// ── TRANSLATIONS ──────────────────────────────────────────────────────────
const T = {
  en: {
    nodes: 'Nodes', addNode: 'Add node', namePlaceholder: 'Name…',
    connect: 'Connect', from: 'From…', to: 'To…', add: 'Add', remove: 'Remove',
    modeEdit: 'Edit', modeWhatif: 'What if…?', modeMC: 'Monte Carlo',
    export: 'Export .json', example: 'Example',
    simDone: '+1,000 simulations completed',
    failBanner: 'What-if mode — click a node to mark it as down',
    impactTitle: 'Failure impact',
    affected: 'Affected nodes', active: 'Active nodes',
    compromised: 'Network compromised', spofsFound: 'SPOFs detected',
    inspectorTitle: 'Inspector', selectNode: 'Select a node\nto see its properties',
    fieldName: 'Name', fieldType: 'Type', fieldProb: 'Failure probability',
    fieldRisk: 'Risk level', fieldDeps: 'Dependencies',
    inDeps: 'incoming', outDeps: 'outgoing',
    riskLow: 'Low', riskMed: 'Medium', riskHigh: 'High',
    deleteNode: 'Delete node',
    mcTitle: 'Monte Carlo',
    mcRun: '▶ Run +1,000 simulations',
    mcRunning: 'Simulating…',
    mcRunAgain: 'Run again',
    mcHint: 'Set failure probabilities\nin Edit mode,\nthen run the simulation.',
    mcAvg: 'Avg. affected nodes', mcSpof: 'Simulations with SPOF failure',
    mcWorst: 'Worst case observed', mcAvgBar: 'Avg. network compromised',
    mcWorstBar: 'Worst case', mcHistTitle: 'Distribution of affected nodes',
    mcHistAxis: 'affected nodes →',
    relayout: 'Re-layout', resetFails: 'Reset failures',
    legendLow: 'Low risk', legendMed: 'Medium risk', legendHigh: 'High risk / down', legendSpof: 'SPOF',
    types: { proceso:'process', persona:'person', sistema:'system', proveedor:'vendor' },
  },
  es: {
    nodes: 'Nodos', addNode: 'Agregar nodo', namePlaceholder: 'Nombre…',
    connect: 'Conectar', from: 'Desde…', to: 'Hasta…', add: 'Agregar', remove: 'Quitar',
    modeEdit: 'Editar', modeWhatif: '¿Qué pasa si…?', modeMC: 'Monte Carlo',
    export: 'Exportar .json', example: 'Ejemplo',
    simDone: '+1,000 simulaciones completadas',
    failBanner: 'Modo "¿qué pasa si…?" — haz clic en un nodo para marcarlo como caído',
    impactTitle: 'Impacto del fallo',
    affected: 'Nodos afectados', active: 'Nodos activos',
    compromised: 'Red comprometida', spofsFound: 'SPOFs detectados',
    inspectorTitle: 'Inspector', selectNode: 'Selecciona un nodo\npara ver sus propiedades',
    fieldName: 'Nombre', fieldType: 'Tipo', fieldProb: 'Probabilidad de fallo',
    fieldRisk: 'Nivel de riesgo', fieldDeps: 'Dependencias',
    inDeps: 'entrantes', outDeps: 'salientes',
    riskLow: 'Bajo', riskMed: 'Medio', riskHigh: 'Alto',
    deleteNode: 'Eliminar nodo',
    mcTitle: 'Monte Carlo',
    mcRun: '▶ Correr +1,000 simulaciones',
    mcRunning: 'Simulando…',
    mcRunAgain: 'Correr de nuevo',
    mcHint: 'Configura las probabilidades\nde fallo en modo Editar,\nluego corre la simulación.',
    mcAvg: 'Nodos afectados (promedio)', mcSpof: 'Simulaciones con SPOF caído',
    mcWorst: 'Peor caso observado', mcAvgBar: 'Red comprometida (promedio)',
    mcWorstBar: 'Peor caso', mcHistTitle: 'Distribución de nodos afectados',
    mcHistAxis: 'nodos afectados →',
    relayout: 'Re-layout', resetFails: 'Resetear fallos',
    legendLow: 'Bajo riesgo', legendMed: 'Riesgo medio', legendHigh: 'Alto riesgo / caído', legendSpof: 'SPOF',
    types: { proceso:'proceso', persona:'persona', sistema:'sistema', proveedor:'proveedor' },
  }
};

let lang = localStorage.getItem('fl-lang') || 'en';
let t = T[lang];

function setLang(l) {
  lang = l; t = T[l];
  localStorage.setItem('fl-lang', l);
  document.documentElement.lang = l;
  document.getElementById('btn-lang-en').classList.toggle('active', l==='en');
  document.getElementById('btn-lang-es').classList.toggle('active', l==='es');
  applyLangToUI();
  renderLeft(); renderRight();
}

function applyLangToUI() {
  document.getElementById('topbar-export').textContent  = t.export;
  document.getElementById('topbar-example').textContent = t.example;
  document.getElementById('btn-edit').textContent       = t.modeEdit;
  document.getElementById('btn-whatif').textContent     = t.modeWhatif;
  document.getElementById('btn-montecarlo').textContent = t.modeMC;
  document.getElementById('left-nodes-title').textContent   = t.nodes;
  document.getElementById('left-addnode-title').textContent = t.addNode;
  document.getElementById('new-name').placeholder           = t.namePlaceholder;
  document.getElementById('left-connect-title').textContent = t.connect;
  document.getElementById('fail-banner').textContent        = t.failBanner;
  document.getElementById('wi-title').textContent    = t.impactTitle;
  document.getElementById('wi-aff-lbl').textContent  = t.affected;
  document.getElementById('wi-act-lbl').textContent  = t.active;
  document.getElementById('wi-pct-lbl').textContent  = t.compromised;
  document.getElementById('wi-spof-lbl').textContent = t.spofsFound;
  document.getElementById('canvas-relayout').textContent     = t.relayout;
  document.getElementById('canvas-resetfails').textContent   = t.resetFails;
  document.getElementById('legend-low').textContent  = t.legendLow;
  document.getElementById('legend-med').textContent  = t.legendMed;
  document.getElementById('legend-high').textContent = t.legendHigh;
  document.getElementById('legend-spof').textContent = t.legendSpof;
  document.getElementById('right-title').textContent = mode==='montecarlo' ? t.mcTitle : t.inspectorTitle;
  refreshEdgeSelects();
}

// ── STATE ──────────────────────────────────────────────────────────────────
let nodes = [], edges = [];
let selNode = null;
let mode = 'edit';
let failed = new Set();
let spofs  = new Set();
let idCtr  = 1;
let mcResults = null;

const TYPES = { proceso:'#5b7fff', persona:'#a78bfa', sistema:'#34d399', proveedor:'#fb923c' };

// ── D3 SETUP ───────────────────────────────────────────────────────────────
const svg = d3.select('#canvas').append('svg');
const g   = svg.append('g');

svg.call(d3.zoom().scaleExtent([.2,4]).on('zoom', e => g.attr('transform', e.transform)));

const gLinks = g.append('g');
const gNodes = g.append('g');

const sim = d3.forceSimulation()
  .force('link',      d3.forceLink().id(d=>d.id).distance(130))
  .force('charge',    d3.forceManyBody().strength(-400))
  .force('center',    d3.forceCenter())
  .force('collision', d3.forceCollide(52))
  .on('tick', tick);

function cx() { return document.getElementById('canvas').clientWidth  / 2; }
function cy() { return document.getElementById('canvas').clientHeight / 2; }

// ── RENDER ─────────────────────────────────────────────────────────────────
function render() {
  sim.force('center').x(cx()).y(cy());

  svg.selectAll('defs').remove();
  svg.insert('defs',':first-child').html(`
    <marker id="arr"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5" stroke-linecap="round"/>
    </marker>
    <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(232,65,90,.7)"   stroke-width="1.5" stroke-linecap="round"/>
    </marker>`);

  const lsel = gLinks.selectAll('.lk').data(edges, d=>d.id);
  lsel.exit().remove();
  lsel.enter().append('line').attr('class','lk');
  gLinks.selectAll('.lk')
    .attr('stroke',       d => d._prop ? 'rgba(232,65,90,.55)' : 'rgba(255,255,255,.15)')
    .attr('stroke-width', d => d._prop ? 2 : 1.5)
    .attr('marker-end',   d => d._prop ? 'url(#arrR)' : 'url(#arr)');

  const nsel = gNodes.selectAll('.nc').data(nodes, d=>d.id);
  nsel.exit().remove();
  const ne = nsel.enter().append('g').attr('class','nc')
    .call(d3.drag()
      .on('start',(e,d)=>{ if(!e.active) sim.alphaTarget(.3).restart(); d.fx=d.x; d.fy=d.y; })
      .on('drag', (e,d)=>{ d.fx=e.x; d.fy=e.y; })
      .on('end',  (e,d)=>{ if(!e.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }))
    .on('click',(e,d)=>{ e.stopPropagation(); nodeClick(d); });
  ne.append('circle').attr('r',28).attr('class','ring').attr('fill','none').attr('stroke-width',3).attr('stroke-dasharray','4 3');
  ne.append('circle').attr('r',26).attr('class','body');
  ne.append('text').attr('class','lbl').attr('y',2) .attr('text-anchor','middle').attr('font-size',11).attr('fill','var(--text)').attr('pointer-events','none');
  ne.append('text').attr('class','prb').attr('y',15).attr('text-anchor','middle').attr('font-size', 9).attr('fill','var(--text3)').attr('pointer-events','none');

  const all = gNodes.selectAll('.nc');
  all.select('.body')
    .attr('fill',   d => nodeColor(d))
    .attr('stroke', d => selNode && selNode.id===d.id ? '#fff' : 'transparent')
    .attr('stroke-width', 2);
  all.select('.ring')
    .attr('stroke', d => spofs.has(d.id) ? '#f5a623' : 'transparent')
    .attr('r', 30);
  all.select('.lbl').text(d => d.name.length>10 ? d.name.slice(0,9)+'…' : d.name);
  all.select('.prb').text(d => Math.round(d.failProb*100)+'%');

  sim.nodes(nodes);
  sim.force('link').links(edges);
  sim.alpha(.1).restart();

  renderLeft();
  refreshEdgeSelects();
  calcSpofs();
}

function nodeColor(d) {
  if (failed.has(d.id)) return '#e8415a';
  if (d._hit)           return '#c0392b';
  const p = d.failProb||0;
  return p<.15 ? '#2ecc88' : p<.35 ? '#f5a623' : '#e8415a';
}

function tick() {
  gLinks.selectAll('.lk')
    .attr('x1',d=>d.source.x).attr('y1',d=>d.source.y)
    .attr('x2',d=>tx(d)).attr('y2',d=>ty(d));
  gNodes.selectAll('.nc').attr('transform',d=>`translate(${d.x},${d.y})`);
}
function tx(d){const dx=d.target.x-d.source.x,dy=d.target.y-d.source.y,l=Math.sqrt(dx*dx+dy*dy)||1;return d.target.x-(dx/l)*32;}
function ty(d){const dx=d.target.x-d.source.x,dy=d.target.y-d.source.y,l=Math.sqrt(dx*dx+dy*dy)||1;return d.target.y-(dy/l)*32;}

// ── LEFT PANEL ─────────────────────────────────────────────────────────────
function renderLeft() {
  document.getElementById('node-list').innerHTML = nodes.map(n=>`
    <div class="nitem${selNode&&selNode.id===n.id?' sel':''}" onclick="selectNode('${n.id}')">
      <div class="ndot" style="background:${nodeColor(n)}"></div>
      <div class="nlabel">${n.name}</div>
      <span class="nbadge spof${spofs.has(n.id)?' on':''}">SPOF</span>
      <span class="nbadge fail${failed.has(n.id)?' on':''}">↓</span>
      <div class="nrisk">${Math.round(n.failProb*100)}%</div>
    </div>`).join('');
}

// ── RIGHT PANEL ────────────────────────────────────────────────────────────
function renderRight() {
  document.getElementById('right-title').textContent = mode==='montecarlo' ? t.mcTitle : t.inspectorTitle;
  const content = document.getElementById('right-content');

  if (mode === 'montecarlo') {
    content.innerHTML = mcHTML();
    return;
  }
  if (!selNode) {
    content.innerHTML = `<div class="empty">${t.selectNode.replace('\n','<br>')}</div>`;
    return;
  }
  const n = selNode;
  const lvl = n.failProb<.15?'low':n.failProb<.35?'med':'high';
  const lvlTxt = n.failProb<.15?t.riskLow:n.failProb<.35?t.riskMed:t.riskHigh;
  const outDeg = edges.filter(e=>(e.source.id||e.source)===n.id).length;
  const inDeg  = edges.filter(e=>(e.target.id||e.target)===n.id).length;

  content.innerHTML = `
    <div class="frow">
      <div class="flbl">${t.fieldName}</div>
      <input class="tinput" style="width:100%" value="${n.name}" oninput="updName(this.value)"/>
    </div>
    <div class="frow">
      <div class="flbl">${t.fieldType}</div>
      <div class="pills">${Object.keys(TYPES).map(tp=>`
        <div class="pill${n.type===tp?' on':''}"
             style="${n.type===tp?'background:'+TYPES[tp]+';border-color:'+TYPES[tp]:''}"
             onclick="updType('${tp}')">${t.types[tp]}</div>`).join('')}
      </div>
    </div>
    <div class="frow">
      <div class="flbl">${t.fieldProb}</div>
      <div class="srow">
        <input type="range" min="1" max="99" value="${Math.round(n.failProb*100)}"
               oninput="updProb(this.value);document.getElementById('pv').textContent=this.value+'%'"/>
        <span class="sval" id="pv">${Math.round(n.failProb*100)}%</span>
      </div>
    </div>
    <div class="frow">
      <div class="flbl">${t.fieldRisk}</div>
      <span class="ibadge ${lvl}">${lvlTxt}</span>
      ${spofs.has(n.id)?'<span class="ibadge med" style="margin-left:4px">SPOF</span>':''}
    </div>
    <div class="frow">
      <div class="flbl">${t.fieldDeps}</div>
      <div class="fval">↑ ${inDeg} ${t.inDeps} &nbsp;·&nbsp; ↓ ${outDeg} ${t.outDeps}</div>
    </div>
    <div style="margin-top:8px">
      <button class="btn dng" style="width:100%" onclick="deleteNode()">${t.deleteNode}</button>
    </div>`;
}

function mcHTML() {
  const hint = `<div class="mc-hint">${t.mcHint.replace(/\n/g,'<br>')}</div>`;
  const results = mcResults ? `
    <div class="mc-card">
      <div class="mcrow"><span class="mclbl">${t.mcAvg}</span><span class="mcval">${mcResults.avg} / ${nodes.length}</span></div>
      <div class="mcrow"><span class="mclbl">${t.mcSpof}</span><span class="mcval" style="color:var(--warn)">${mcResults.spofPct}%</span></div>
      <div class="mcrow"><span class="mclbl">${t.mcWorst}</span><span class="mcval" style="color:var(--danger)">${mcResults.worst} nodes</span></div>
      <div class="barwrap">
        <div class="barlbl">${t.mcAvgBar}</div>
        <div class="barbg"><div class="barfill" style="width:${mcResults.avgPct}%;background:${mcResults.avgPct<20?'var(--ok)':mcResults.avgPct<50?'var(--warn)':'var(--danger)'}"></div></div>
      </div>
      <div class="barwrap">
        <div class="barlbl">${t.mcWorstBar}</div>
        <div class="barbg"><div class="barfill" style="width:${mcResults.worstPct}%;background:var(--danger)"></div></div>
      </div>
    </div>
    ${histHTML(mcResults.hist)}` : hint;

  return `<button class="btn pri mc-run-btn" id="mc-btn" onclick="runMC()">${t.mcRun}</button>${results}`;
}

function histHTML(hist) {
  const entries = Object.entries(hist).sort((a,b)=>+a[0]-+b[0]);
  const maxV = Math.max(...entries.map(([,v])=>v),1);
  const N = 10000;
  const bars = entries.map(([k,v])=>{
    const h = Math.round(v/maxV*48);
    const p = Math.round(v/N*100);
    const c = +k===0?'var(--ok)':+k<nodes.length*.4?'var(--warn)':'var(--danger)';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:1px;flex:1">
      <div style="font-family:var(--mono);font-size:8px;color:var(--text3)">${p>0?p+'%':''}</div>
      <div style="width:100%;background:${c};height:${h}px;border-radius:2px 2px 0 0;min-height:2px"></div>
      <div style="font-family:var(--mono);font-size:8px;color:var(--text3)">${k}</div>
    </div>`;
  }).join('');
  return `<div class="mc-card">
    <div class="barlbl" style="margin-bottom:8px">${t.mcHistTitle}</div>
    <div style="display:flex;align-items:flex-end;gap:2px;height:65px">${bars}</div>
    <div style="font-size:10px;color:var(--text3);text-align:center;margin-top:4px">${t.mcHistAxis}</div>
  </div>`;
}

// ── NODE ACTIONS ───────────────────────────────────────────────────────────
function nodeClick(d) {
  if (mode==='whatif') { toggleFailed(d); return; }
  selNode = d;
  renderLeft(); renderRight();
  gNodes.selectAll('.nc .body').attr('stroke', n => selNode&&selNode.id===n.id?'#fff':'transparent');
}
function selectNode(id) { nodeClick(nodes.find(n=>n.id===id)); }

function updName(v) { if(selNode){selNode.name=v; render(); renderRight();} }
function updType(tp) { if(selNode){selNode.type=tp; selNode.typeColor=TYPES[tp]; render(); renderRight();} }
function updProb(v) { if(selNode){selNode.failProb=+v/100; render(); renderRight();} }
function deleteNode() {
  if(!selNode) return;
  nodes = nodes.filter(n=>n.id!==selNode.id);
  edges = edges.filter(e=>{
    const s=e.source.id||e.source, t=e.target.id||e.target;
    return s!==selNode.id && t!==selNode.id;
  });
  failed.delete(selNode.id);
  selNode=null; render(); renderRight();
}

function addNode() {
  const inp = document.getElementById('new-name');
  const name = inp.value.trim(); if(!name) return;
  const a = Math.random()*Math.PI*2, r = 120+Math.random()*80;
  nodes.push({ id:'n'+idCtr++, name, type:'proceso', typeColor:TYPES.proceso, failProb:.1,
               x:cx()+Math.cos(a)*r, y:cy()+Math.sin(a)*r });
  inp.value=''; render();
}

function refreshEdgeSelects() {
  ['edge-from','edge-to'].forEach((id,i)=>{
    const sel=document.getElementById(id), cur=sel.value;
    sel.innerHTML=`<option value="">${i===0?t.from:t.to}</option>`+
      nodes.map(n=>`<option value="${n.id}"${n.id===cur?' selected':''}>${n.name}</option>`).join('');
  });
  document.getElementById('btn-add-edge').textContent    = t.add;
  document.getElementById('btn-remove-edge').textContent = t.remove;
}

function addEdge() {
  const f=document.getElementById('edge-from').value, tgt=document.getElementById('edge-to').value;
  if(!f||!tgt||f===tgt) return;
  const exists=edges.some(e=>(e.source.id||e.source)===f&&(e.target.id||e.target)===tgt);
  if(exists) return;
  edges.push({id:'e'+Date.now(), source:f, target:tgt});
  render();
}
function removeEdge() {
  const f=document.getElementById('edge-from').value, tgt=document.getElementById('edge-to').value;
  if(!f||!tgt) return;
  edges=edges.filter(e=>(e.source.id||e.source)!==f||(e.target.id||e.target)!==tgt);
  render();
}

// ── MODES ──────────────────────────────────────────────────────────────────
function setMode(m) {
  mode = m;
  ['edit','whatif','montecarlo'].forEach(x =>
    document.getElementById('btn-'+x).classList.toggle('active', x===m));
  document.getElementById('fail-banner').style.display = m==='whatif' ? 'block' : 'none';
  document.getElementById('whatif-box').style.display  = m==='whatif' ? 'block' : 'none';
  if (m!=='whatif') resetFailed();
  renderRight();
}

// ── WHAT-IF ────────────────────────────────────────────────────────────────
function toggleFailed(d) {
  failed.has(d.id) ? failed.delete(d.id) : failed.add(d.id);
  propagate(); render(); updateWI();
}
function propagate() {
  nodes.forEach(n=>n._hit=false); edges.forEach(e=>e._prop=false);
  const vis=new Set(failed), q=[...failed];
  while(q.length){
    const cur=q.shift();
    edges.forEach(e=>{
      const s=e.source.id||e.source, tgt=e.target.id||e.target;
      if(s===cur&&!vis.has(tgt)){ vis.add(tgt); q.push(tgt); e._prop=true;
        const tn=nodes.find(n=>n.id===tgt); if(tn&&!failed.has(tgt)) tn._hit=true; }
    });
  }
}
function resetFailed() {
  failed.clear(); nodes.forEach(n=>n._hit=false); edges.forEach(e=>e._prop=false);
  render(); updateWI();
}
function updateWI() {
  const aff=nodes.filter(n=>failed.has(n.id)||n._hit).length;
  const pct=nodes.length?Math.round(aff/nodes.length*100):0;
  document.getElementById('wi-aff').textContent  = aff||'—';
  document.getElementById('wi-act').textContent  = aff?nodes.length-aff:'—';
  document.getElementById('wi-pct').textContent  = pct?pct+'%':'—';
  document.getElementById('wi-spof').textContent = spofs.size||'0';
}

// ── SPOF DETECTION ─────────────────────────────────────────────────────────
function calcSpofs() {
  spofs.clear(); if(nodes.length<2) return;
  const adj={};
  nodes.forEach(n=>adj[n.id]=[]);
  edges.forEach(e=>{
    const s=e.source.id||e.source, tgt=e.target.id||e.target;
    adj[s].push(tgt); adj[tgt].push(s);
  });
  const vis={},disc={},low={},par={};
  let timer=0;
  function dfs(u){
    vis[u]=true; disc[u]=low[u]=timer++;
    let ch=0,ap=false;
    for(const v of adj[u]){
      if(!vis[v]){ ch++; par[v]=u; dfs(v); low[u]=Math.min(low[u],low[v]);
        if(par[u]===undefined&&ch>1) ap=true;
        if(par[u]!==undefined&&low[v]>=disc[u]) ap=true;
      } else if(v!==par[u]) low[u]=Math.min(low[u],disc[v]);
    }
    if(ap) spofs.add(u);
  }
  nodes.forEach(n=>{ if(!vis[n.id]) dfs(n.id); });
}

// ── MONTE CARLO ────────────────────────────────────────────────────────────
function runMC() {
  const btn = document.getElementById('mc-btn');
  if(!btn) return;
  btn.disabled=true; btn.textContent=t.mcRunning;

  setTimeout(()=>{
    const N=10000;
    let total=0, spofHits=0, worst=0;
    const hist={};

    for(let i=0;i<N;i++){
      const f=new Set();
      nodes.forEach(n=>{ if(Math.random()<n.failProb) f.add(n.id); });
      const vis=new Set(f), q=[...f];
      while(q.length){
        const cur=q.shift();
        edges.forEach(e=>{
          const s=e.source.id||e.source, tgt=e.target.id||e.target;
          if(s===cur&&!vis.has(tgt)){ vis.add(tgt); q.push(tgt); f.add(tgt); }
        });
      }
      const sz=f.size;
      total+=sz; worst=Math.max(worst,sz);
      let hs=false; f.forEach(id=>{ if(spofs.has(id)) hs=true; }); if(hs) spofHits++;
      hist[Math.min(nodes.length,sz)]=(hist[Math.min(nodes.length,sz)]||0)+1;
    }

    const avg=(total/N).toFixed(1);
    const avgPct=Math.round(total/N/Math.max(nodes.length,1)*100);
    const worstPct=Math.round(worst/Math.max(nodes.length,1)*100);
    mcResults={ avg, avgPct, worst, worstPct, spofPct:(spofHits/N*100).toFixed(1), hist };

    document.getElementById('sim-label').textContent = t.simDone;
    renderRight();
  }, 30);
}

// ── SAVE / LOAD ────────────────────────────────────────────────────────────
function saveGraph() {
  const data=JSON.stringify({
    nodes: nodes.map(n=>({...n,_hit:undefined})),
    edges: edges.map(e=>({id:e.id, source:e.source.id||e.source, target:e.target.id||e.target}))
  },null,2);
  const a=document.createElement('a');
  a.href='data:application/json,'+encodeURIComponent(data);
  a.download='riskmap.json'; a.click();
}

function loadExample() {
  nodes=[
    {id:'n1',name:'CRM',       type:'sistema',   typeColor:TYPES.sistema,   failProb:.08, x:cx(),     y:cy()-150},
    {id:'n2',name:'Ventas',    type:'proceso',   typeColor:TYPES.proceso,   failProb:.12, x:cx()-160, y:cy()-60},
    {id:'n3',name:'Facturación',type:'proceso',  typeColor:TYPES.proceso,   failProb:.18, x:cx()+160, y:cy()-60},
    {id:'n4',name:'ERP',       type:'proveedor', typeColor:TYPES.proveedor, failProb:.35, x:cx(),     y:cy()+60},
    {id:'n5',name:'Soporte',   type:'proceso',   typeColor:TYPES.proceso,   failProb:.09, x:cx()-160, y:cy()+140},
    {id:'n6',name:'Ana García',type:'persona',   typeColor:TYPES.persona,   failProb:.25, x:cx()+160, y:cy()+140},
    {id:'n7',name:'Reportes',  type:'proceso',   typeColor:TYPES.proceso,   failProb:.07, x:cx(),     y:cy()+230},
  ];
  edges=[
    {id:'e1',source:'n1',target:'n2'},{id:'e2',source:'n1',target:'n3'},
    {id:'e3',source:'n4',target:'n1'},{id:'e4',source:'n2',target:'n5'},
    {id:'e5',source:'n3',target:'n6'},{id:'e6',source:'n5',target:'n7'},
    {id:'e7',source:'n6',target:'n7'},{id:'e8',source:'n4',target:'n3'},
  ];
  idCtr=8; selNode=null; failed.clear(); mcResults=null;
  render(); renderRight();
}

// ── INIT ───────────────────────────────────────────────────────────────────
svg.on('click', ()=>{ if(mode==='edit'){ selNode=null; renderRight(); renderLeft(); }});
document.getElementById('new-name').addEventListener('keydown', e=>{ if(e.key==='Enter') addNode(); });
setLang(lang);
loadExample();
