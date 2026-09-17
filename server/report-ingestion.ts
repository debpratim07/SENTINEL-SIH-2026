import { createHash } from 'node:crypto'
import type { ScheduleActivity } from '../src/lib/connected-types.ts'

export const MAX_REPORT_BYTES=4*1024*1024
export const MAX_EXTRACTED_TEXT=50000
export const SUPPORTED_REPORT_TYPES={
  'text/plain':'txt','text/csv':'csv','application/pdf':'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx',
} as const

export interface ExtractionCandidate {
  event_type:'start'|'finish'|'progress_observation'
  actual_date:string|null
  source_quote:string
  source_location:string
  suggested_activity_id:string|null
  suggestion_reason:string|null
  confidence:number|null
}

export interface ParsedReport { text:string; sha256:string; warnings:string[] }

function normalizedFilename(value:string){
  const name=value.trim()
  if(!name||name.length>240||/[\\/\0]/.test(name))throw new Error('Choose a file with a valid name.')
  return name
}

function decodeBase64(value:string){
  if(!value||value.length>Math.ceil(MAX_REPORT_BYTES/3)*4+8||!/^[A-Za-z0-9+/]*={0,2}$/.test(value)||value.length%4!==0)throw new Error('The uploaded file is not valid base64 content.')
  const data=Buffer.from(value,'base64')
  if(!data.length||data.length>MAX_REPORT_BYTES)throw new Error('Reports must be between 1 byte and 4 MB.')
  if(data.toString('base64').replace(/=+$/,'')!==value.replace(/=+$/,''))throw new Error('The uploaded file is not valid base64 content.')
  return data
}

function cleanText(text:string){
  const value=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').replace(/\u0000/g,'').trim()
  if(!value)throw new Error('No readable text was found in this report.')
  if(value.length>MAX_EXTRACTED_TEXT)throw new Error('The extracted report text exceeds the 50,000 character project evidence limit.')
  return value
}

export async function parseUploadedReport(input:{filename:string;mediaType:string;sourceSize:number;contentBase64:string}):Promise<ParsedReport>{
  const filename=normalizedFilename(input.filename)
  const extension=filename.toLowerCase().split('.').pop()??''
  const expected=SUPPORTED_REPORT_TYPES[input.mediaType as keyof typeof SUPPORTED_REPORT_TYPES]
  if(!expected||extension!==expected)throw new Error('Unsupported report format. Use PDF, DOCX, XLSX, CSV, or TXT with a matching content type.')
  const data=decodeBase64(input.contentBase64)
  if(!Number.isInteger(input.sourceSize)||input.sourceSize!==data.length)throw new Error('The reported file size does not match the uploaded content.')
  const warnings:string[]=[]
  let text=''
  if(expected==='txt'||expected==='csv'){
    try{text=new TextDecoder('utf-8',{fatal:true}).decode(data)}catch{throw new Error('Text and CSV reports must use UTF-8 encoding.')}
  }else if(expected==='pdf'){
    const {PDFParse}=await import('pdf-parse')
    const parser=new PDFParse({data})
    try{text=(await parser.getText()).text}finally{await parser.destroy()}
    warnings.push('Embedded PDF text was extracted. Scanned-image OCR is not enabled.')
  }else if(expected==='docx'){
    const mammoth=await import('mammoth')
    const result=await mammoth.extractRawText({buffer:data})
    text=result.value
    warnings.push(...result.messages.map(message=>`DOCX: ${message.message}`).slice(0,5))
  }else{
    const XLSX=await import('xlsx')
    const workbook=XLSX.read(data,{type:'buffer',cellFormula:false,cellHTML:false,cellStyles:false,cellText:true})
    text=workbook.SheetNames.map(name=>`Sheet: ${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name],{blankrows:false})}`).join('\n\n')
    warnings.push('Spreadsheet formulas were not executed; displayed cell values were extracted as evidence text.')
  }
  return {text:cleanText(text),sha256:createHash('sha256').update(data).digest('hex'),warnings}
}

const startTerms=/\b(start(?:ed|s|ing)?|commenc(?:ed|es|ing)|began|initiated|erected|installed|laid|mobilized)\b/i
const finishTerms=/\b(complet(?:ed|es|ion)|finish(?:ed|es)|commissioned|closed out)\b/i
const progressTerms=/\b(progress|ongoing|underway|continued|partial|pending)\b/i

function isoDate(text:string):string|null{
  const iso=text.match(/\b(20\d{2})-(0[1-9]|1[0-2])-([0-2]\d|3[01])\b/)?.[0]
  if(iso&&!Number.isNaN(Date.parse(`${iso}T00:00:00Z`)))return iso
  const numeric=text.match(/\b([0-2]?\d|3[01])[\/-](0?\d|1[0-2])[\/-](20\d{2})\b/)
  if(numeric){const value=`${numeric[3]}-${numeric[2].padStart(2,'0')}-${numeric[1].padStart(2,'0')}`;if(!Number.isNaN(Date.parse(`${value}T00:00:00Z`)))return value}
  const named=text.match(/\b([0-2]?\d|3[01])\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(20\d{2})\b/i)
  if(named){const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];const month=months.findIndex(value=>named[2].toLowerCase().startsWith(value))+1;return `${named[3]}-${String(month).padStart(2,'0')}-${named[1].padStart(2,'0')}`}
  return null
}

function tokens(value:string){return new Set(value.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(token=>token.length>2))}
function suggestActivity(statement:string,activities:ScheduleActivity[]){
  const statementLower=statement.toLowerCase(), statementTokens=tokens(statement)
  const ranked=activities.filter(activity=>activity.level==='L6').map(activity=>{
    const refs=[activity.external_id,activity.equipment_ref].filter(Boolean) as string[]
    const exact=refs.some(ref=>statementLower.includes(ref.toLowerCase()))
    const activityTokens=tokens(`${activity.external_id} ${activity.name} ${activity.discipline??''} ${activity.area??''} ${activity.equipment_ref??''}`)
    const overlap=[...activityTokens].filter(token=>statementTokens.has(token)).length
    const score=exact?1:activityTokens.size?overlap/activityTokens.size:0
    return {activity,score,exact,overlap}
  }).sort((a,b)=>b.score-a.score||a.activity.external_id.localeCompare(b.activity.external_id))
  const best=ranked[0]
  if(!best||(!best.exact&&best.overlap<2))return {id:null,reason:null,confidence:null}
  return {id:best.activity.id,reason:best.exact?'Exact activity or equipment reference appears in the source.':`${best.overlap} schedule terms overlap with the source statement.`,confidence:Math.round(Math.min(best.score,.89)*100)/100}
}

export function deterministicCandidates(text:string,reportDate:string,activities:ScheduleActivity[]):{candidates:ExtractionCandidate[];warnings:string[]}{
  const lines=text.split(/\n+/).flatMap(line=>line.split(/(?<=[.!?])\s+/)).map(line=>line.trim()).filter(Boolean)
  const candidates:ExtractionCandidate[]=[]
  for(let index=0;index<lines.length&&candidates.length<50;index++){
    const source=lines[index]
    let event:ExtractionCandidate['event_type']|null=null
    if(finishTerms.test(source))event='finish'
    else if(startTerms.test(source))event='start'
    else if(progressTerms.test(source))event='progress_observation'
    if(!event)continue
    const found=isoDate(source), actualDate=found&&found<=reportDate?found:null
    const suggestion=suggestActivity(source,activities)
    candidates.push({event_type:event,actual_date:actualDate,source_quote:source,source_location:`Statement ${index+1}`,suggested_activity_id:suggestion.id,suggestion_reason:suggestion.reason,confidence:suggestion.confidence})
  }
  const warnings:string[]=[]
  if(!candidates.length)warnings.push('No explicit start, finish, or progress statement was found. The report is preserved for inspection without generated candidates.')
  if(candidates.some(candidate=>!candidate.actual_date))warnings.push('One or more extracted statements did not include a valid date on or before the report date.')
  return {candidates,warnings}
}

export function validateCandidates(value:unknown,text:string,reportDate:string,activities:ScheduleActivity[]):ExtractionCandidate[]{
  if(!Array.isArray(value)||value.length>50)throw new Error('The intelligence provider returned an invalid candidate collection.')
  const allowed=new Set(activities.filter(activity=>activity.level==='L6').map(activity=>activity.id))
  return value.map((item,index)=>{
    if(!item||typeof item!=='object')throw new Error(`Candidate ${index+1} is malformed.`)
    const record=item as Record<string,unknown>, event=record.event_type
    if(!['start','finish','progress_observation'].includes(String(event)))throw new Error(`Candidate ${index+1} has an unsupported event type.`)
    const quote=typeof record.source_quote==='string'?record.source_quote.trim():''
    if(!quote||!text.includes(quote))throw new Error(`Candidate ${index+1} is not grounded in an exact source quote.`)
    const date=record.actual_date===null||record.actual_date===''?null:String(record.actual_date)
    if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(`${date}T00:00:00Z`))||date>reportDate))throw new Error(`Candidate ${index+1} has an invalid date.`)
    const activity=record.suggested_activity_id===null||record.suggested_activity_id===''?null:String(record.suggested_activity_id)
    if(activity&&!allowed.has(activity))throw new Error(`Candidate ${index+1} references an unavailable activity.`)
    const confidence=record.confidence===null||record.confidence===undefined?null:Number(record.confidence)
    if(confidence!==null&&(!Number.isFinite(confidence)||confidence<0||confidence>1))throw new Error(`Candidate ${index+1} has invalid confidence.`)
    return {event_type:event as ExtractionCandidate['event_type'],actual_date:date,source_quote:quote,source_location:typeof record.source_location==='string'?record.source_location.slice(0,500):`Candidate ${index+1}`,suggested_activity_id:activity,suggestion_reason:typeof record.suggestion_reason==='string'?record.suggestion_reason.slice(0,2000):null,confidence}
  })
}
