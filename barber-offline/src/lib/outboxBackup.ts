/* eslint-disable @typescript-eslint/no-explicit-any */
const API = process.env.NEXT_PUBLIC_BACKUP_API ?? "http://localhost:4000";
const KEY = "backup_outbox_v1";

function load(){ try{return JSON.parse(localStorage.getItem(KEY)??"[]");}catch{return[];} }
function save(v:any){ localStorage.setItem(KEY, JSON.stringify(v)); }

export async function trySendOrEnqueue(snapshot:any){
  try{
    const r = await fetch(`${API}/backups`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(snapshot), keepalive:true
    });
    if(!r.ok) throw new Error();
  }catch{
    const q = load(); q.push({ snapshot, t: Date.now() }); save(q);
  }
}
export async function flushOutbox(){
  const q = load(); if(!q.length) return;
  const remain:any[]=[];
  for(const item of q){
    try{
      const r=await fetch(`${API}/backups`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(item.snapshot) });
      if(!r.ok) remain.push(item);
    }catch{ remain.push(item); }
  }
  save(remain);
}
export function setupFlushers(){
  window.addEventListener("online", flushOutbox);
  window.addEventListener("focus", flushOutbox);
  flushOutbox();
}
