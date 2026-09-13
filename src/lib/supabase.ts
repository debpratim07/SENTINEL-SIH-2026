import { createClient } from '@supabase/supabase-js'

const url=import.meta.env.VITE_SUPABASE_URL
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = url && key?.startsWith('sb_publishable_')
  ? createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})
  : null

export async function api<T>(path:string, body?:unknown):Promise<T> {
  if (!supabase) throw new Error('The project connection has not been configured.')
  const {data,error}=await supabase.auth.getSession()
  if (error || !data.session) throw new Error('Sign in to continue.')
  const response=await fetch(path,{
    method:body===undefined?'GET':'POST',
    headers:{Authorization:`Bearer ${data.session.access_token}`,...(body===undefined?{}:{'Content-Type':'application/json'})},
    ...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(30000)
  })
  const result=await response.json().catch(()=>({error:'The application service did not respond correctly.'}))
  if (!response.ok) throw new Error(result.error ?? 'The request failed.')
  return result as T
}
