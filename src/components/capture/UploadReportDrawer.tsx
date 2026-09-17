import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react'
import Drawer from '../ui/Drawer'
import { uploadProjectReport } from '../../lib/connected-api'
import type { ReportUploadResponse } from '../../lib/connected-types'

interface Props { open:boolean; onClose:()=>void; projectId:string; onComplete:()=>void }
const ACCEPT='.pdf,.docx,.xlsx,.csv,.txt'
const MAX_BYTES=4*1024*1024

function toBase64(file:File):Promise<string>{
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('The selected file could not be read.'));reader.onload=()=>resolve(String(reader.result).split(',')[1]??'');reader.readAsDataURL(file)})
}
function mediaType(file:File){
  if(file.type)return file.type
  const extension=file.name.toLowerCase().split('.').pop()
  return ({txt:'text/plain',csv:'text/csv',pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'} as Record<string,string>)[extension??'']??'application/octet-stream'
}

export default function UploadReportDrawer({open,onClose,projectId,onComplete}:Props){
  const inputRef=useRef<HTMLInputElement>(null)
  const [file,setFile]=useState<File|null>(null)
  const [reportDate,setReportDate]=useState(()=>new Date().toISOString().slice(0,10))
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [result,setResult]=useState<ReportUploadResponse|null>(null)
  useEffect(()=>{if(open)return;setFile(null);setBusy(false);setError('');setResult(null)},[open])
  function choose(next:File|undefined){setError('');setResult(null);if(!next)return;if(next.size>MAX_BYTES){setError('Choose a file no larger than 4 MB.');return}setFile(next)}
  async function submit(){
    if(!file){setError('Choose a report file first.');return}
    setBusy(true);setError('')
    try{
      const response=await uploadProjectReport(projectId,{request_key:crypto.randomUUID(),report_date:reportDate,filename:file.name,media_type:mediaType(file),source_size:file.size,content_base64:await toBase64(file)})
      setResult(response);onComplete()
    }catch(cause){setError(cause instanceof Error?cause.message:'The report could not be ingested.')}
    finally{setBusy(false)}
  }
  return <Drawer open={open} onClose={onClose} width={620} aria-label="Upload Report"><div className="flex h-full flex-col">
    <header className="flex shrink-0 items-start justify-between border-b p-7" style={{borderColor:'var(--c-border)'}}><div><h2 className="text-[20px] font-bold" style={{color:'var(--c-text)'}}>Upload report</h2><p className="mt-1 max-w-[470px] text-[13px]" style={{color:'var(--c-muted)'}}>Extract execution statements from a project report. Every candidate remains pending until an authorized reviewer verifies it.</p></div><button onClick={onClose} aria-label="Close"><X size={17}/></button></header>
    <div className="flex-1 overflow-y-auto p-7">
      {!result&&<div className="space-y-5">
        <button type="button" onClick={()=>inputRef.current?.click()} onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();choose(event.dataTransfer.files[0])}} className="flex w-full flex-col items-center rounded-[14px] border-2 border-dashed px-6 py-10 text-center" style={{borderColor:'var(--c-border-strong)',background:'var(--c-page)'}}><Upload size={24} style={{color:'#F46F29'}}/><span className="mt-3 text-[14px] font-semibold" style={{color:'var(--c-text)'}}>{file?file.name:'Choose or drop a report'}</span><span className="mt-1 text-[12px]" style={{color:'var(--c-muted)'}}>PDF with embedded text, DOCX, XLSX, CSV or TXT · maximum 4 MB</span></button>
        <input ref={inputRef} className="sr-only" type="file" accept={ACCEPT} onChange={event=>choose(event.target.files?.[0])}/>
        {file&&<div className="flex items-center gap-3 rounded-[10px] p-3" style={{background:'var(--c-card)',border:'1px solid var(--c-border)'}}><FileText size={17} style={{color:'#F46F29'}}/><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{color:'var(--c-text)'}}>{file.name}</p><p className="text-[11px]" style={{color:'var(--c-muted)'}}>{(file.size/1024).toFixed(1)} KB · content is parsed on the server</p></div></div>}
        <label className="block text-[12px] font-semibold" style={{color:'var(--c-text)'}}>Report date<input className="mt-2 block w-full rounded-[9px] px-3 py-2 text-[13px]" style={{background:'var(--c-page)',border:'1px solid var(--c-border)'}} type="date" value={reportDate} onChange={event=>setReportDate(event.target.value)} required/></label>
        <div className="rounded-[10px] p-3 text-[12px]" style={{background:'var(--c-brand-tint)',color:'var(--c-muted)'}}><strong style={{color:'var(--c-text)'}}>Evidence boundary:</strong> scanned-image OCR is not enabled. PDF ingestion reads embedded text only; unsupported or unreadable files fail explicitly.</div>
      </div>}
      {result&&<section className="rounded-[14px] p-5" style={{background:'rgba(22,163,74,.07)',border:'1px solid rgba(22,163,74,.22)'}}><CheckCircle2 size={23} style={{color:'#16A34A'}}/><h3 className="mt-3 text-[16px] font-bold" style={{color:'var(--c-text)'}}>Report processed</h3><p className="mt-1 text-[13px]" style={{color:'var(--c-muted)'}}>{result.candidate_count} evidence-grounded candidate{result.candidate_count===1?'':'s'} added to the Review Queue.</p><dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]"><div><dt style={{color:'var(--c-subtle)'}}>Extraction</dt><dd className="mt-1 font-semibold" style={{color:'var(--c-text)'}}>{result.extraction_method}</dd></div><div><dt style={{color:'var(--c-subtle)'}}>AI provider</dt><dd className="mt-1 font-semibold" style={{color:'var(--c-text)'}}>{result.ai_status==='used'?'Used':result.ai_status==='failed'?'Failed; deterministic fallback used':'Not configured; deterministic extraction used'}</dd></div></dl>{result.warnings.length>0&&<ul className="mt-4 space-y-1 text-[12px]" style={{color:'#B45309'}}>{result.warnings.map(warning=><li key={warning} className="flex gap-2"><AlertTriangle size={14}/>{warning}</li>)}</ul>}</section>}
      {error&&<p role="alert" className="mt-4 flex gap-2 rounded-[10px] p-3 text-[12px] text-red-700" style={{background:'rgba(220,38,38,.08)'}}><AlertTriangle size={15}/>{error}</p>}
    </div>
    <footer className="flex shrink-0 justify-end gap-3 border-t p-5" style={{borderColor:'var(--c-border)'}}><button onClick={onClose} className="rounded-[9px] px-4 py-2 text-[13px] font-semibold" style={{border:'1px solid var(--c-border)',color:'var(--c-text)'}}>{result?'Done':'Cancel'}</button>{!result&&<button disabled={busy||!file||!reportDate} onClick={()=>void submit()} className="flex items-center gap-2 rounded-[9px] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50" style={{background:'linear-gradient(135deg,#F46F29,#F59B4C)'}}>{busy?<Loader2 className="animate-spin" size={15}/>:<Upload size={15}/>} {busy?'Processing genuine request…':'Process report'}</button>}</footer>
  </div></Drawer>
}
