const $ = id => document.getElementById(id);
const state = { running:false };

function fmt(n){ return Number(n || 0).toFixed(2); }
function mbps(bytes, ms){ return bytes * 8 / (ms / 1000) / 1000000; }

async function pingTest(){
  const samples=[];
  for(let i=0;i<4;i++){
    const t=performance.now();
    await fetch(`/api/ping?x=${Math.random()}`,{cache:"no-store"});
    samples.push(performance.now()-t);
  }
  samples.sort((a,b)=>a-b);
  return samples[Math.floor(samples.length/2)];
}

async function downloadTest(){
  const bytes=20*1024*1024;
  const t=performance.now();
  const response=await fetch(`/api/download?bytes=${bytes}&x=${Math.random()}`,{cache:"no-store"});
  const reader=response.body.getReader();
  let total=0;
  while(true){
    const {done,value}=await reader.read();
    if(done) break;
    total += value.byteLength;
    const elapsed=performance.now()-t;
    $("speed").textContent=fmt(mbps(total,elapsed));
    $("phase").textContent="DOWNLOAD";
  }
  return mbps(total,performance.now()-t);
}

function randomBytes(size){
  const a=new Uint8Array(size);
  crypto.getRandomValues(a);
  return a;
}

async function uploadTest(){
  const bytes=8*1024*1024;
  const payload=randomBytes(bytes);
  const t=performance.now();
  const response=await fetch(`/api/upload?x=${Math.random()}`,{
    method:"POST",body:payload,headers:{"Content-Type":"application/octet-stream"},
    cache:"no-store"
  });
  if(!response.ok) throw new Error("Upload test gagal");
  return mbps(bytes,performance.now()-t);
}

async function run(){
  if(state.running) return;
  state.running=true;
  $("start").disabled=true;
  $("error")?.remove();

  try{
    $("phase").textContent="PING";
    const ping=await pingTest();
    $("ping").textContent=Math.round(ping);

    const down=await downloadTest();
    $("download").textContent=fmt(down);
    $("speed").textContent=fmt(down);

    $("phase").textContent="UPLOAD";
    const up=await uploadTest();
    $("upload").textContent=fmt(up);
    $("speed").textContent=fmt(up);

    $("phase").textContent="DONE";
    saveResult({download:down,upload:up,ping});
    renderHistory();
  }catch(e){
    $("phase").textContent="ERROR";
    $("speed").textContent="0.00";
    alert("Speedtest gagal: "+e.message);
  }finally{
    $("start").disabled=false;
    state.running=false;
  }
}

function saveResult(r){
  const items=JSON.parse(localStorage.getItem("nikonet-history")||"[]");
  items.unshift({date:new Date().toLocaleString("id-ID"),...r});
  localStorage.setItem("nikonet-history",JSON.stringify(items.slice(0,10)));
}
function renderHistory(){
  const items=JSON.parse(localStorage.getItem("nikonet-history")||"[]");
  $("historyList").innerHTML=items.length?items.map(x=>`
    <div class="result">
      <span>${x.date}</span><b>↓ ${fmt(x.download)} Mbps</b>
      <b>↑ ${fmt(x.upload)} Mbps</b><b>Ping ${Math.round(x.ping)} ms</b>
    </div>`).join(""):'<p class="muted">Belum ada hasil test.</p>';
}
async function loadInfo(){
  $("browser").textContent=navigator.userAgent.split(" ").slice(-1)[0] || "Browser";
  $("time").textContent=new Date().toLocaleString("id-ID");
  try{
    const r=await fetch("https://ipapi.co/json/",{cache:"no-store"});
    const d=await r.json();
    $("ip").textContent=d.ip||"-";
    $("isp").textContent=d.org||"-";
    $("location").textContent=[d.city,d.country_name].filter(Boolean).join(", ")||"-";
  }catch{
    $("ip").textContent="Tidak tersedia";
    $("isp").textContent="Tidak tersedia";
    $("location").textContent="Tidak tersedia";
  }
}
$("start").addEventListener("click",run);
$("year").textContent=new Date().getFullYear();
renderHistory();
loadInfo();
