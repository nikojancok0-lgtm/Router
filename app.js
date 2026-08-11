const $=id=>document.getElementById(id);
const CF="https://speed.cloudflare.com";
const MB=1000000;
const sizes=[5*1024*1024,10*1024*1024,20*1024*1024];

function f(n){return Number(n||0).toFixed(2)}
function bps(bytes,ms){return bytes*8/(ms/1000)}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function ping(){
  let best=Infinity;
  for(let i=0;i<5;i++){
    const t=performance.now();
    const r=await fetch(CF+"/__down?bytes=0&measId="+Date.now()+"-"+i,{cache:"no-store"});
    await r.arrayBuffer();
    best=Math.min(best,performance.now()-t);
  }
  return best;
}

async function download(){
  let bytes=0, start=performance.now(), last=0;
  for(const size of sizes){
    const u=CF+"/__down?bytes="+size+"&measId="+Date.now()+"-"+Math.random();
    const t=performance.now();
    const r=await fetch(u,{cache:"no-store"});
    if(!r.ok) throw new Error("Server download menolak request");
    const reader=r.body?.getReader();
    if(reader){
      while(true){
        const {done,value}=await reader.read(); if(done) break;
        bytes+=value.byteLength;
        const ms=performance.now()-start;
        if(ms-last>100){ $("speed").textContent=f(bps(bytes,ms)/MB); last=ms; }
      }
    }else{
      const buf=await r.arrayBuffer(); bytes+=buf.byteLength;
    }
  }
  return bps(bytes,performance.now()-start)/MB;
}

function randomBytes(n){
  const a=new Uint8Array(n);
  if(crypto.getRandomValues) crypto.getRandomValues(a);
  else for(let i=0;i<n;i++) a[i]=Math.random()*256;
  return a;
}

async function upload(){
  const chunks=[2*1024*1024,4*1024*1024,8*1024*1024];
  let total=0, start=performance.now();
  for(const n of chunks){
    const fd=new FormData();
    fd.append("upload",new Blob([randomBytes(n)],{type:"application/octet-stream"}),"speedtest.bin");
    const r=await fetch(CF+"/__up?measId="+Date.now()+"-"+Math.random(),{method:"POST",body:fd,cache:"no-store"});
    if(!r.ok) throw new Error("Server upload menolak request");
    total+=n;
    $("speed").textContent=f(bps(total,performance.now()-start)/MB);
  }
  return bps(total,performance.now()-start)/MB;
}

async function run(){
  $("start").disabled=true;
  $("phase").textContent="PING";
  try{
    const p=await ping(); $("ping").textContent=Math.round(p);
    $("phase").textContent="DOWNLOAD";
    const d=await download(); $("download").textContent=f(d); $("speed").textContent=f(d);
    $("phase").textContent="UPLOAD";
    const u=await upload(); $("upload").textContent=f(u); $("speed").textContent=f(u);
    $("phase").textContent="DONE";
    save({download:d,upload:u,ping:p});
  }catch(e){
    $("phase").textContent="ERROR";
    alert("Speedtest gagal: "+e.message+"\n\nCoba matikan VPN/AdBlock atau buka dengan jaringan lain.");
  }finally{$("start").disabled=false}
}
function save(x){const a=JSON.parse(localStorage.getItem("nikonet-history")||"[]");a.unshift({date:new Date().toLocaleString("id-ID"),...x});localStorage.setItem("nikonet-history",JSON.stringify(a.slice(0,10)));render()}
function render(){const a=JSON.parse(localStorage.getItem("nikonet-history")||"[]");$("historyList").innerHTML=a.length?a.map(x=>`<div class="result"><span>${esc(x.date)}</span><b>↓ ${f(x.download)} Mbps</b><b>↑ ${f(x.upload)} Mbps</b><b>Ping ${Math.round(x.ping)} ms</b></div>`).join(""):'<p class="muted">Belum ada hasil test.</p>'}
async function meta(){try{const r=await fetch(CF+"/meta",{cache:"no-store"});const d=await r.json();$("ip").textContent=d.clientIp||"-";$("isp").textContent=d.asOrganization?`${d.asOrganization} (AS${d.asn||"-"})`:"-";$("location").textContent=[d.city,d.country].filter(Boolean).join(", ")||"-"}catch{$("ip").textContent=$("isp").textContent=$("location").textContent="Tidak tersedia"}$("time").textContent=new Date().toLocaleString("id-ID");$("browser").textContent=/Android/i.test(navigator.userAgent)?"Android / Chrome":"Browser"}
$("start").onclick=run;$("clearHistory").onclick=()=>{localStorage.removeItem("nikonet-history");render()};$("year").textContent=new Date().getFullYear();render();meta();