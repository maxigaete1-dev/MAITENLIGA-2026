
const V=document.querySelector("#view"), buttons=[...document.querySelectorAll("nav button")];
const medal=i=>["🥇","🥈","🥉"][i]||i+1;
function go(p){buttons.forEach(b=>b.classList.toggle("active",b.dataset.page===p)); render(p); scrollTo(0,0)}
buttons.forEach(b=>b.onclick=()=>go(b.dataset.page));
function inicio(){return `<section class="hero"><div class="crown">♛</div><h1>MAITENLIGA 2026</h1><div class="tag">La liga de los amigos</div></section>
<h2>ÚLTIMA FECHA</h2><div class="card"><div class="tag">Fecha 6 · Sábado</div><div class="score"><span>Equipo A</span><span class="yellow">8 - 6</span><span>Equipo B</span></div></div>
<div class="card"><div class="yellow">⭐ JUGADOR DE LA FECHA</div><h2>Maxi Yamal</h2><div class="stats"><div><b>4</b><small>Goles</small></div><div><b>2</b><small>Asist.</small></div><div><b>1</b><small>MVP</small></div><div><b>+3</b><small>Pts</small></div><div><b>🔥</b><small>Racha</small></div></div></div>
<div class="grid"><div class="card award">💪 Pulmón<b>Vale Modrić</b></div><div class="card award">🧤 Atajada<b>Jairen Courtois</b></div><div class="card award">🪵 Tronco<b>Rafael Raphinha</b></div><div class="card award">🪓 Patadas<b>Walala Ramos</b></div></div>`}
function ranking(){let rows=PLAYERS.map((p,i)=>`<tr><td>${medal(i)}</td><td>${p.name}</td><td>${p.pj}</td><td>${p.g}</td><td>${p.a}</td><td>${p.mvp}</td><td><b>${p.pts}</b></td></tr>`).join("");
return `<h2>🏆 RANKING</h2><div class="card"><table><tr><th>#</th><th>Jugador</th><th>PJ</th><th>G</th><th>A</th><th>MVP</th><th>PTS</th></tr>${rows}</table></div>
<h2>LÍDERES</h2><div class="grid"><div class="card award">⚽ Goleador<b>Maxi Yamal</b><span class="yellow">12 goles</span></div><div class="card award">🎯 Asistidor<b>Lester Mbappé</b><span class="yellow">8 asistencias</span></div><div class="card award">⭐ Más MVP<b>Maxi Yamal</b><span class="yellow">3 MVP</span></div><div class="card award">🟨 Más tarjetas<b>Walala Ramos</b><span class="yellow">5 amarillas</span></div></div>`}
function jugadores(){return `<h2>👥 JUGADORES</h2>${PLAYERS.map((p,i)=>`<div class="card player" onclick="profile(${i})"><div class="left"><div class="avatar">${p.name.split(" ")[0][0]}${p.name.split(" ")[1][0]}</div><div><b>${p.name}</b><div class="tag">${p.pos}</div></div></div><span class="pill">${p.pts} pts ›</span></div>`).join("")}`}
function profile(i){let p=PLAYERS[i];V.innerHTML=`<button class="back" onclick="go('jugadores')">← Jugadores</button><div class="card"><div class="left"><div class="avatar">${p.name[0]}</div><div><h1>${p.name}</h1><div class="tag">${p.pos}</div></div></div></div>
<div class="card"><div class="stats"><div><b>${p.pj}</b><small>PJ</small></div><div><b>${p.g}</b><small>Goles</small></div><div><b>${p.a}</b><small>Asist.</small></div><div><b>${p.mvp}</b><small>MVP</small></div><div><b>${p.pts}</b><small>Pts</small></div></div></div>
<div class="card"><h3>ÚLTIMOS PARTIDOS</h3><p>F6 ⚽ ⚽ 🎯 &nbsp; · &nbsp; F5 ⚽ &nbsp; · &nbsp; F4 🎯 🎯 &nbsp; · &nbsp; F3 ⚽</p></div>`}
function historial(){return `<h2>📊 DATOS QUE NADIE PIDIÓ</h2><div class="card">
<div class="fact"><i>🔥</i><div><b>Maxi Yamal</b> lleva 3 fechas consecutivas marcando.</div></div>
<div class="fact"><i>🎯</i><div><b>Lester Mbappé</b> lidera las asistencias con 8.</div></div>
<div class="fact"><i>🫁</i><div><b>Vale Modrić</b> ha jugado todas las fechas.</div></div>
<div class="fact"><i>🧤</i><div><b>Jairen Courtois</b> suma 4 vallas invictas.</div></div>
<div class="fact"><i>🪓</i><div><b>Walala Ramos</b> lidera las tarjetas: 5 amarillas y 1 roja.</div></div>
<div class="fact"><i>⚡</i><div><b>Rafael Raphinha</b> lleva 180 minutos sin convertir.</div></div></div>`}
function render(p){V.innerHTML=({inicio,ranking,jugadores,historial}[p]||inicio)()} render("inicio");
