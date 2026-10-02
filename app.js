const CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vRfaC8Z9GDnjyLsdMCw6Lr4bBx5jvgmDHJy-fBNao-HIvDSFPaiFJU4gPDgmo9pfXgYYJmVXJjVP-Gs/pub?gid=1006372394&single=true&output=csv";
const ROSTER=[
["Maxi Yamal","Jugador"],["Lester Mbappé","Jugador"],["Vale Modrić","Jugador"],["Jose Bellingham","Jugador"],
["Lucho Vinícius","Jugador"],["Chalo Haaland","Jugador"],["Jairen Courtois","Arquero"],["Juanjo Insigne","Jugador"],
["Luxito Dibu","Arquero"],["Ale Neymar","Jugador"],["Walala Ramos","Defensa"],["Rafael Raphinha","Jugador"]
];
let rows=[];
let stats=[];
let currentPage="inicio";
const V=document.getElementById("view");
const sync=document.getElementById("sync");
const buttons=Array.from(document.querySelectorAll("nav button"));
const yes=v=>["si","sí","yes","1","true","x"].includes(String(v||"").trim().toLowerCase());
const num=v=>{const n=Number(String(v??"").replace(",","."));return Number.isFinite(n)?n:0};

function blankStats(){
 stats=ROSTER.map(([name,pos])=>({name,pos,pj:0,g:0,a:0,w:0,mvp:0,y:0,r:0,gc:0,cs:0,ga:0,pts:0}));
}
function parseCSV(text){
 const out=[];let row=[],val="",quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i], next=text[i+1];
  if(c=='"' && quoted && next=='"'){val+='"';i++}
  else if(c=='"'){quoted=!quoted}
  else if(c==","&&!quoted){row.push(val);val=""}
  else if((c=="\n"||c=="\r")&&!quoted){
   if(c=="\r"&&next=="\n")i++;
   row.push(val); if(row.some(x=>x.trim()))out.push(row); row=[];val="";
  } else val+=c;
 }
 row.push(val); if(row.some(x=>x.trim()))out.push(row);
 return out;
}
function normalize(table){
 const hi=table.findIndex(r=>r.some(c=>String(c).trim().toLowerCase()==="fecha"));
 if(hi<0) throw new Error("No se encontró la columna Fecha");
 const headers=table[hi].map(x=>String(x).trim());
 return table.slice(hi+1).filter(r=>r.some(x=>String(x).trim())).map(r=>{
  const o={}; headers.forEach((h,i)=>o[h]=r[i]||""); return o;
 });
}
function field(o,names){
 for(const n of names) if(Object.prototype.hasOwnProperty.call(o,n)) return o[n];
 return "";
}
function calculate(){
 stats=ROSTER.map(([name,pos])=>{
  const rr=rows.filter(r=>String(field(r,["Jugador","jugador"])).trim()===name && yes(field(r,["Jugó","Jugo","jugó","jugo"])));
  const s={name,pos,pj:rr.length,g:0,a:0,w:0,mvp:0,y:0,r:0,gc:0,cs:0,ga:0,pts:0};
  rr.forEach(x=>{
   s.g+=num(field(x,["Goles","goles"]));
   s.a+=num(field(x,["Asistencias","Asist.","asistencias"]));
   s.w+=yes(field(x,["Victoria","Ganó","Gano","victoria"]))?1:0;
   s.mvp+=yes(field(x,["MVP","mvp"]))?1:0;
   s.y+=num(field(x,["Amarillas","🟨","amarillas"]));
   s.r+=num(field(x,["Rojas","🟥","rojas"]));
   s.gc+=num(field(x,["Goles recibidos","goles recibidos"]));
   s.cs+=yes(field(x,["Valla invicta","valla invicta"]))?1:0;
  });
  s.ga=s.g+s.a; s.pts=s.g*3+s.a*2+s.w*2+s.mvp*3; return s;
 }).sort((a,b)=>b.pts-a.pts||b.ga-a.ga||a.name.localeCompare(b.name));
}
function played(){return rows.filter(r=>yes(field(r,["Jugó","Jugo","jugó","jugo"])))}
function top(k){return [...stats].sort((a,b)=>b[k]-a[k]||a.name.localeCompare(b.name))[0]}
function empty(){
 return `<div class="card empty"><b>⚽ Temporada lista para comenzar</b><span class="tag">Los 12 jugadores están cargados en cero.</span><p>Cuando ingreses la primera jornada en FECHAS, las estadísticas se actualizarán automáticamente.</p></div>`;
}
function inicio(){
 const p=played();
 if(!p.length)return `<div class="hero"><h1>♛ MAITENLIGA 2026</h1><div class="tag">La liga de los amigos</div></div>${empty()}`;
 const dates=[...new Set(p.map(r=>field(r,["Fecha","fecha"])).filter(Boolean))];
 const last=dates[dates.length-1], lr=p.filter(r=>field(r,["Fecha","fecha"])===last), m=lr.find(r=>yes(field(r,["MVP","mvp"])));
 return `<div class="hero"><h1>♛ MAITENLIGA 2026</h1><div class="tag">La liga de los amigos</div></div><h2>ÚLTIMA FECHA</h2><div class="card"><div class="tag">Fecha ${last}</div><h2>${lr.length} jugadores participaron</h2></div>${m?`<div class="card"><div class="yellow">⭐ MVP DE LA FECHA</div><h2>${field(m,["Jugador","jugador"])}</h2><div class="stats"><div><b>${num(field(m,["Goles","goles"]))}</b><small>Goles</small></div><div><b>${num(field(m,["Asistencias","Asist.","asistencias"]))}</b><small>Asist.</small></div><div><b>⭐</b><small>MVP</small></div><div><b>${yes(field(m,["Victoria","Ganó","Gano"]))?"🏆":"—"}</b><small>Victoria</small></div><div><b>${num(field(m,["Amarillas","🟨"]))}</b><small>🟨</small></div></div></div>`:""}`;
}
function ranking(){
 const tr=stats.map((p,i)=>`<tr><td>${["🥇","🥈","🥉"][i]||i+1}</td><td>${p.name}</td><td>${p.pj}</td><td>${p.g}</td><td>${p.a}</td><td>${p.mvp}</td><td><b>${p.pts}</b></td></tr>`).join("");
 let leaders=played().length?`<h2>LÍDERES</h2><div class="grid"><div class="card award">⚽ Goleador<b>${top("g").name}</b><span class="yellow">${top("g").g} goles</span></div><div class="card award">🎯 Asistidor<b>${top("a").name}</b><span class="yellow">${top("a").a} asist.</span></div><div class="card award">⭐ Más MVP<b>${top("mvp").name}</b><span class="yellow">${top("mvp").mvp} MVP</span></div><div class="card award">🟨 Tarjetas<b>${top("y").name}</b><span class="yellow">${top("y").y} amarillas</span></div></div>`:`<div class="card notice">Los líderes aparecerán después de la primera fecha.</div>`;
 return `<h2>🏆 RANKING</h2><div class="card"><table><tr><th>#</th><th>Jugador</th><th>PJ</th><th>G</th><th>A</th><th>MVP</th><th>PTS</th></tr>${tr}</table></div>${leaders}`;
}
function jugadores(){
 return `<h2>👥 JUGADORES</h2>${stats.map(p=>`<button type="button" class="card player" data-player="${p.name}"><span><b>${p.name}</b><span class="tag" style="display:block">${p.pos}</span></span><span class="pill">${p.pts} pts ›</span></button>`).join("")}`;
}
function profile(name){
 const p=stats.find(x=>x.name===name); if(!p)return;
 V.innerHTML=`<button type="button" id="backPlayers" style="background:none;border:0;color:var(--y);font-weight:bold;cursor:pointer">← Jugadores</button><div class="card"><h1>${p.name}</h1><div class="tag">${p.pos}</div></div><div class="card"><div class="stats"><div><b>${p.pj}</b><small>PJ</small></div><div><b>${p.g}</b><small>Goles</small></div><div><b>${p.a}</b><small>Asist.</small></div><div><b>${p.mvp}</b><small>MVP</small></div><div><b>${p.pts}</b><small>Pts</small></div></div>${p.pos==="Arquero"?`<hr style="border-color:var(--line)"><div class="stats"><div><b>${p.gc}</b><small>Recibidos</small></div><div><b>${p.cs}</b><small>Vallas inv.</small></div></div>`:""}</div>`;
 document.getElementById("backPlayers").addEventListener("click",()=>go("jugadores"));
}
function historial(){
 if(!played().length)return `<h2>📊 HISTORIAL</h2>${empty()}`;
 return `<h2>📊 DATOS QUE NADIE PIDIÓ</h2><div class="card"><div class="fact">🔥 <b>${top("g").name}</b> manda en goles con ${top("g").g}.</div><div class="fact">🎯 <b>${top("a").name}</b> lidera las asistencias con ${top("a").a}.</div><div class="fact">🏆 <b>${top("w").name}</b> suma ${top("w").w} victorias.</div><div class="fact">🪓 <b>${top("y").name}</b> lidera las amarillas con ${top("y").y}.</div></div>`;
}
function bindPlayerButtons(){
 V.querySelectorAll("[data-player]").forEach(b=>b.addEventListener("click",()=>profile(b.dataset.player)));
}
function go(page){
 currentPage=page; buttons.forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 const fn={inicio,ranking,jugadores,historial}[page]||inicio; V.innerHTML=fn(); bindPlayerButtons();
}
buttons.forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
blankStats(); go("inicio");
sync.textContent="Conectando con Google Sheets…";

async function loadSheet(){
 const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),8000);
 try{
  const res=await fetch(CSV_URL+"&_="+Date.now(),{cache:"no-store",signal:controller.signal});
  if(!res.ok)throw new Error("HTTP "+res.status);
  const text=await res.text(); rows=normalize(parseCSV(text)); calculate();
  sync.textContent="● Google Sheets conectado";
 }catch(e){
  rows=[]; blankStats();
  sync.textContent="⚠ Planilla no disponible · navegación activa";
  console.error(e);
 }finally{
  clearTimeout(timer); go(currentPage);
 }
}
loadSheet();
