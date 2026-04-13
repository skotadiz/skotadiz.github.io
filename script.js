// Garante que a página abra no topo ao carregar ou atualizar
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

// Estados Globais de Sistema
let systemThreatLevel = 0;
const THREAT_THRESHOLD = 85;

/**
 * Simula a detecção de ameaças em tempo real.
 */
function monitorThreatLevel() {
  systemThreatLevel += (Math.random() - 0.45) * 5;
  systemThreatLevel = Math.max(0, Math.min(100, systemThreatLevel));
  
  if (systemThreatLevel > THREAT_THRESHOLD) {
    if (!document.body.classList.contains('emergency-mode')) {
      triggerEmergency();
    }
  }
}

function triggerEmergency() {
  document.body.classList.add('emergency-mode');
  triggerWarning(); // O hexágono de WARNING que já criamos
  addSecurityLog("CRITICAL: DATA_BREACH_IN_PROGRESS", "log-crit");
  saoAnnouncement("SECURITY OVERRIDE: EXECUTE 'SCAN' TO PURGE");
}

function resolveEmergency() {
  document.body.classList.remove('emergency-mode');
  systemThreatLevel = 10;
  addSecurityLog("System purged. Integrity restored.", "log-warn");
  saoNotify("SYSTEM STATUS: SECURE");
}

setInterval(monitorThreatLevel, 3000);

// ─── CURSOR ───
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isTouch) {
  cur.style.display = 'none';
  ring.style.display = 'none';
  document.body.classList.add('is-touch');
}

let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  if(isTouch) return;
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});

/**
 * Anima o anel do cursor usando uma interpolação suave (easing) baseada na posição atual do mouse.
 */
function animRing(){
  if(isTouch) return;
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();

// ─── LOADER (Movido para o topo para garantir execução imediata) ───
const lbar=document.getElementById('lbar');
const ltxt=document.getElementById('ltext');
const msgs=['Inicializando sistemas...','Carregando módulos...','Conectando à nave Bebop...','Sistemas online — pronto.'];
let prog=0,mi=0;
const loadInt=setInterval(()=>{
  prog+=Math.random()*4+1;
  if(prog>100) prog=100;
  if(lbar) lbar.style.width=prog+'%';
  if(ltxt) ltxt.textContent=msgs[Math.floor(mi/25)%msgs.length]; mi++;
  if(prog>=100){
    clearInterval(loadInt);
    setTimeout(()=>{
      const l=document.getElementById('loader');
      if(l){
        l.style.transition='opacity .6s';
        l.style.opacity='0';
        setTimeout(()=>l.style.display='none',600);
      }
    },400);
  }
},40);

// ─── PARTICLES ───
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let W,H,particles=[];

/**
 * Redimensiona o canvas de partículas para preencher as dimensões atuais da janela.
 */
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();
window.addEventListener('resize',resize);

/**
 * Representa uma partícula individual animada no fundo do site.
 */
class Particle{
  /**
   * Inicializa uma nova partícula.
   */
  constructor(){this.reset()}
  /**
   * Reseta as propriedades da partícula para valores aleatórios iniciais.
   */
  reset(){
    this.x=Math.random()*W; this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*.25; this.vy=(Math.random()-.5)*.25;
    this.r=Math.random()*1.2+.3;
    const c=Math.random();
    if(c<.6) this.color='rgba(255,255,255,';
    else if(c<.8) this.color='rgba(245,166,35,';
    else this.color='rgba(76,201,240,';
    this.alpha=Math.random()*.5+.1;
    this.life=Math.random()*200+100; this.age=0;
  }
  /**
   * Atualiza a posição e a idade da partícula para o próximo frame.
   */
  update(){
    this.x+=this.vx; this.y+=this.vy; this.age++;
    
    // Interatividade: Repulsão do mouse
    let dx = mx - this.x;
    let dy = my - this.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 100){
      let force = (100 - dist) / 100;
      this.x -= dx * force * 0.03;
      this.y -= dy * force * 0.03;
    }

    if(this.age>this.life||this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
  }
  /**
   * Renderiza a partícula no contexto do canvas com efeitos de fade-in e fade-out.
   */
  draw(){
    const a=this.age<20?this.age/20:this.age>this.life-20?(this.life-this.age)/20:1;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=this.color+(this.alpha*a)+')';
    ctx.fill();
  }
}
const particleCount = isTouch ? 40 : 120;
for(let i=0;i<particleCount;i++) particles.push(new Particle());

let frameExecutionTime = 0;
let lastFrameTimestamp = 0;

/**
 * Loop principal de animação do canvas: limpa o quadro e redesenha todas as partículas.
 */
function animParticles(){
  const start = performance.now();
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw()});
  const end = performance.now();
  
  // Acumula o tempo de execução real do script
  frameExecutionTime += (end - start);
  lastFrameTimestamp++;

  requestAnimationFrame(animParticles);
}
animParticles();

// ─── COMPETENCY CLOUD SYSTEM ───
const skillsData = [
  { name: "Common Vulnerability Scoring System (Cvss)", url: "https://www.credly.com/skills/common-vulnerability-scoring-system-cvss" },
  { name: "Disaster Recovery", url: "https://www.credly.com/skills/disaster-recovery" },
  { name: "Evidence Handling And Attack Attribution", url: "https://www.credly.com/skills/evidence-handling-and-attack-attribution" },
  { name: "Governance", url: "https://www.credly.com/skills/governance" },
  { name: "Incident Response", url: "https://www.credly.com/skills/incident-response" },
  { name: "Network And Server Profiling", url: "https://www.credly.com/skills/network-and-server-profiling" },
  { name: "Penetration Testing", url: "https://www.credly.com/skills/penetration-testing" },
  { name: "Risk Assessment", url: "https://www.credly.com/skills/risk-assessment" },
  { name: "Risk Management", url: "https://www.credly.com/skills/risk-management" },
  { name: "Secure Device Management", url: "https://www.credly.com/skills/secure-device-management" },
  { name: "Security Assessment", url: "https://www.credly.com/skills/security-assessment" },
  { name: "Security Controls", url: "https://www.credly.com/skills/security-controls" },
  { name: "The Cyber Kill Chain", url: "https://www.credly.com/skills/the-cyber-kill-chain" },
  { name: "The Diamond Model of Intrusion Analysis", url: "https://www.credly.com/skills/the-diamond-model-of-intrusion-analysis" },
  { name: "Ethical Hacking", url: "https://www.credly.com/skills/ethical-hacking" },
  { name: "Exploiting Applications", url: "https://www.credly.com/skills/exploiting-applications" },
  { name: "Exploiting Networks", url: "https://www.credly.com/skills/exploiting-networks" },
  { name: "IoT Security", url: "https://www.credly.com/skills/iot-security" },
  { name: "Pentesting Tools", url: "https://www.credly.com/skills/pentesting-tools" },
  { name: "Reporting", url: "https://www.credly.com/skills/reporting" },
  { name: "Social Engineering", url: "https://www.credly.com/skills/social-engineering" },
  { name: "Vulnerability Management", url: "https://www.credly.com/skills/vulnerability-management" },
  { name: "Vulnerability Scanning", url: "https://www.credly.com/skills/vulnerability-scanning" },
  { name: "Cyber Best Practices", url: "https://www.credly.com/skills/cyber-best-practices" },
  { name: "Cybersecurity", url: "https://www.credly.com/skills/cybersecurity" },
  { name: "Network Vulnerabilities", url: "https://www.credly.com/skills/network-vulnerabilities" },
  { name: "Privacy And Data Confidentiality", url: "https://www.credly.com/skills/privacy-and-data-confidentiality" },
  { name: "Threat Detection", url: "https://www.credly.com/skills/threat-detection" },
  { name: "AI Learning", url: "https://www.credly.com/skills/ai-learning" },
  { name: "Chatbots", url: "https://www.credly.com/skills/chatbots" },
  { name: "Computer Vision", url: "https://www.credly.com/skills/computer-vision" },
  { name: "Machine Learning", url: "https://www.credly.com/skills/machine-learning" },
  { name: "Machine Translation", url: "https://www.credly.com/skills/machine-translation" },
  { name: "Prompting Tips", url: "https://www.credly.com/skills/prompting-tips" },
  { name: "Documentation", url: "https://www.credly.com/skills/documentation" },
  { name: "Endpoints Devices", url: "https://www.credly.com/skills/endpoints-devices" },
  { name: "Help Desk", url: "https://www.credly.com/skills/help-desk" },
  { name: "Network Troubleshooting", url: "https://www.credly.com/skills/network-troubleshooting" },
  { name: "Support", url: "https://www.credly.com/skills/support" },
  { name: "User Support", url: "https://www.credly.com/skills/user-support" },
  { name: "Application Layer Services", url: "https://www.credly.com/skills/application-layer-services" },
  { name: "Cisco Devices", url: "https://www.credly.com/skills/cisco-devices" },
  { name: "Cisco IOS", url: "https://www.credly.com/skills/cisco-ios" },
  { name: "Cisco Routers", url: "https://www.credly.com/skills/cisco-routers" },
  { name: "Cisco Switches", url: "https://www.credly.com/skills/cisco-switches" },
  { name: "Cloud Services", url: "https://www.credly.com/skills/cloud-services" },
  { name: "Copper and Fiber Cabling", url: "https://www.credly.com/skills/copper-and-fiber-cabling" },
  { name: "Ethernet", url: "https://www.credly.com/skills/ethernet" },
  { name: "Hierarchical Network Design", url: "https://www.credly.com/skills/hierarchical-network-design" },
  { name: "IPv4 Addressing", url: "https://www.credly.com/skills/ipv4-addressing" },
  { name: "IPv6 Addressing", url: "https://www.credly.com/skills/ipv6-addressing" },
  { name: "Network Layer Protocols", url: "https://www.credly.com/skills/network-layer-protocols" },
  { name: "Network Media", url: "https://www.credly.com/skills/network-media" },
  { name: "Network Types", url: "https://www.credly.com/skills/network-types" },
  { name: "Protocols Standards", url: "https://www.credly.com/skills/protocols-standards" },
  { name: "Transport Layer Protocols", url: "https://www.credly.com/skills/transport-layer-protocols" },
  { name: "Troubleshooting", url: "https://www.credly.com/skills/troubleshooting" },
  { name: "Wireless Access", url: "https://www.credly.com/skills/wireless-access" },
  { name: "Network Troubleshooting", url: "https://www.credly.com/skills/network-troubleshooting" },
];

/**
 * Renderiza a nuvem de competências garantindo que não haja duplicatas.
 * Utiliza um Map para indexar por nome, mantendo apenas a primeira ocorrência.
 */
function renderValidatedSkills() {
  const container = document.getElementById('validated-skills');
  if (!container) return;

  // Filtro de Unicidade: Cria um Map usando o nome como chave. 
  // Isso remove automaticamente qualquer duplicata no array de dados.
  const uniqueSkills = [...new Map(skillsData.map(item => [item.name, item])).values()];

  // Ordenação Alfabética: Organiza os itens de A-Z para facilitar a leitura.
  uniqueSkills.sort((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = uniqueSkills.map(skill => `
    <a href="${skill.url}" 
       target="_blank" 
       class="comp-tag" 
       onclick="playItemSound()">
       ${skill.name}
    </a>
  `).join('');
}

/**
 * Função segura para adicionar novas competências via console ou terminal sem duplicar.
 */
function registerNewSkill(name, url) {
  if (!skillsData.find(s => s.name === name)) {
    skillsData.push({ name, url });
    renderValidatedSkills();
  }
}

// ─── QUEST SYSTEM LOGIC ───
let quests = JSON.parse(localStorage.getItem('achievements_paf') || JSON.stringify({
  hero: { title: "Início da Jornada", desc: "Acesse o sistema Bebop-OS", completed: false, icon: "fa-rocket" },
  sobre: { title: "Conhecendo o Usuário", desc: "Leia o perfil profissional", completed: false, icon: "fa-user-ninja" },
  habilidades: { title: "Weapon Mastery", desc: "Analise a árvore de skills", completed: false, icon: "fa-khanda" },
  certificacoes: { title: "Bounty Hunter", desc: "Visualize o mural de recompensas", completed: false, icon: "fa-scroll" },
  experiencia: { title: "Viajante do Tempo", desc: "Explore a timeline histórica", completed: false, icon: "fa-hourglass-half" },
  projetos: { title: "Arquiteto de Sistemas", desc: "Inspecione os artefatos criados", completed: false, icon: "fa-microchip" },
  social: { title: "Herói Local", desc: "Veja o impacto social gerado", completed: false, icon: "fa-heart" },
  conquistas: { title: "Completionist", desc: "Acesse a central de conquistas", completed: false, icon: "fa-trophy" },
  contato: { title: "Estabelecer Link", desc: "Prepare-se para comunicação", completed: false, icon: "fa-terminal" },
  wanted: { title: "Bounty Hunter", desc: "Gere um cartaz de procurado", completed: false, icon: "fa-user-secret" },
  gate: { title: "Hyperspace Traveler", desc: "Atravesse o portão hiperespacial", completed: false, icon: "fa-door-open" },
  samba: { title: "Mushroom Samba", desc: "Ative o modo psicodélico", completed: false, icon: "fa-pills" }
}));

let allQuestsCompletedSoundPlayed = Object.values(quests).every(q => q.completed);
function saveQuests() { localStorage.setItem('achievements_paf', JSON.stringify(quests)); }

function completeQuest(id) {
  if (quests[id] && !quests[id].completed) {
    quests[id].completed = true;
    saoNotify(`QUEST COMPLETE: ${quests[id].title}`);
    saveQuests();
    renderAchievements();
  }
}

function renderAchievements() {
  const list = document.getElementById('quest-list');
  const grid = document.getElementById('achievement-grid');
  if (!list && !grid) return;

  const html = Object.keys(quests).map(key => {
    const q = quests[key];
    return `
      <div class="ach-card ${q.completed ? 'unlocked' : ''}">
        <i class="fas ${q.icon} ach-icon"></i>
        <div class="ach-title">${q.title}</div>
        <div class="ach-desc">${q.desc}</div>
      </div>`;
  }).join('');

  if (grid) grid.innerHTML = html;
  if (list) {
    list.innerHTML = Object.keys(quests).map(key => {
      const q = quests[key];
      return `<div class="quest-item ${q.completed ? 'completed' : ''}">
        <div class="quest-info"><span class="q-title">${q.title}</span></div>
        <span class="q-status">${q.completed ? 'OK' : '??'}</span>
      </div>`;
    }).join('');
  }
  updateXP();
}

let playerInventory = [];
const marketCatalog = [
  { id: "SW-01", name: "Plasma Cannon [Mk.I]", type: "HARDWARE", cost: 500000, power: 15.5 },
  { id: "SAO-EL", name: "Elucidator [Carbon]", type: "COMBAT", cost: 1200000, power: 25.0 },
  { id: "SEC-BR", name: "Kernel Rootkit", type: "SECURITY", cost: 300000, power: 10.0 },
  { id: "SW-ENG", "name": "Hermes Engine", type: "HARDWARE", cost: 800000, power: 18.2 }
];

/**
 * Lógica de combate que integra o "Nível" do usuário com o Boss.
 * Demonstra o uso de promessas e simulação de latência de rede.
 */
async function initiateBossDuel(bossId) {
  const lv = parseInt(document.getElementById('sao-lv-val').innerText);
  const chance = Math.min(99, (lv / 74) * 100).toFixed(1);
  
  // Efeito Visual de "Link Start"
  saoAnnouncement("LINK START: INICIANDO DUELO NEURAL...");
  document.body.classList.add('gate-active');
  
  // Simula o processamento do BountyHunterService.java
  setTimeout(() => {
    document.body.classList.remove('gate-active');
    const success = (Math.random() * 100) <= chance;
    
    if (success) {
      saoNotify(`BOSS DEFEATED! 50M Woolongs transferidos.`, "var(--gold)");
      const hpSegments = document.querySelectorAll('.boss-card .hp-segment');
      hpSegments.forEach(seg => seg.style.background = 'transparent');
      document.getElementById('boss-reward-74').innerText = "STATUS: CLEARED";
      completeQuest('certificacoes'); // Reutiliza a quest de Bounty Hunter
      addSecurityLog("Target 'Gleam Eyes' eliminated. Hash verified.", "log-warn");
    } else {
      triggerWarning();
      saoNotify("HP CRITICAL: LOGOUT FORÇADO PELO CARDINAL", "var(--red)");
    }
  }, 2500);
}

function updateNeuralLink() {
  const lv = parseInt(document.getElementById('sao-lv-val').innerText);
  const winChance = document.getElementById('win-chance');
  if (winChance) {
    const chance = Math.min(99, (lv / 74) * 100).toFixed(1);
    winChance.innerText = `${chance}% PROBABILITY`;
  }
}

function updateXP() {
  const total = Object.keys(quests).length;
  const completed = Object.values(quests).filter(q => q.completed).length;
  const pct = (completed / total) * 100;
  const fill = document.getElementById('sao-xp-fill');
  const lv = document.getElementById('sao-lv-val');
  if (fill) fill.style.width = pct + '%';
  if (lv) lv.innerText = Math.floor(completed * 2.5) + 1;
  
  // Atualiza o HUD com um efeito de "Data Stream"
  updateNeuralLink();

  if (completed === total && !allQuestsCompletedSoundPlayed) {
    allQuestsCompletedSoundPlayed = true;
    setTimeout(() => {
      playLevelUpSound();
      saoNotify("CONGRATULATIONS: 100% COMPLETION REACHED!", "var(--gold)");
    }, 500);
  }
}

function toggleBlackMarket() {
  const modal = document.getElementById('market-modal');
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) renderMarket();
}

function renderMarket() {
  const grid = document.getElementById('market-grid');
  grid.innerHTML = marketCatalog.map(item => `
    <div class="item-card">
      <div class="item-name">${item.name}</div>
      <div class="item-price">${item.cost.toLocaleString()} ₩</div>
      <button class="item-buy-btn" onclick="buyMarketItem('${item.id}')">BUY</button>
    </div>
  `).join('');
}

function buyMarketItem(itemId) {
  const item = marketCatalog.find(i => i.id === itemId);
  if (!item) return;

  saoAnnouncement(`PURCHASING: ${item.name}...`);
  
  setTimeout(() => {
    saoNotify(`ITEM ACQUIRED: ${item.name}`, "var(--teal)");
    playerInventory.push(item);
    window.playerPowerBoost = (window.playerPowerBoost || 0) + item.power;
    updateNeuralLink();
    addSecurityLog(`Market: Item ${item.id} registered to player.`, "log-warn");
    renderInventory();
  }, 1500);
}

function toggleInventory() {
  const modal = document.getElementById('inventory-modal');
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) renderInventory();
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;
  if (playerInventory.length === 0) {
    grid.innerHTML = "<div style='grid-column: span 3; opacity:0.5'>Inventário Vazio. Visite o Black Market ou derrote Bosses.</div>";
    return;
  }
  grid.innerHTML = playerInventory.map(item => `
    <div class="item-card" style="border-color:var(--teal)">
      <div class="item-name">${item.name}</div>
      <div class="item-price">POWER: +${item.power}</div>
    </div>
  `).join('');
}

// ─── MATRIX RAIN ENGINE ───
const mCanvas = document.getElementById('matrix-canvas');
const mCtx = mCanvas.getContext('2d');
let columns;
const fontSize = 14;
let drops = [];

function initMatrix() {
  mCanvas.width = window.innerWidth;
  mCanvas.height = window.innerHeight;
  columns = mCanvas.width / fontSize;
  drops = Array(Math.floor(columns)).fill(1);
}

function drawMatrix() {
  mCtx.fillStyle = 'rgba(8, 8, 15, 0.05)';
  mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
  mCtx.fillStyle = '#06ffa5';
  mCtx.font = fontSize + 'px monospace';
  for(let i = 0; i < drops.length; i++) {
    const text = String.fromCharCode(Math.random() * 128);
    mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
    if(drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
let matrixInterval;

// ─── SCROLL REVEAL ───
const revealEls=document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.tl-item');
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'),i*80);
  });
},{threshold:.1});
revealEls.forEach(el=>obs.observe(el));

// ─── SKILL BARS ───
/**
 * Observa as barras de habilidades e as anima quando entram na tela.
 */
const bars = document.querySelectorAll('.bar-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const targetWidth = e.target.style.getPropertyValue('--w') || '0%';
      e.target.style.width = targetWidth;
      barObs.unobserve(e.target);
    }
  });
},{threshold:.3});
bars.forEach(b => barObs.observe(b));

// ─── PROJECT CARD MOUSE TRACK ───
/**
 * Calcula a posição do mouse dentro de um card para o efeito de iluminação.
 * @param {MouseEvent} e - O evento de movimento do mouse.
 * @param {HTMLElement} el - O elemento do card sendo rastreado.
 */
function trackMouse(e, el) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const xc = rect.width / 2;
  const yc = rect.height / 2;
  const dx = x - xc;
  const dy = y - yc;
  
  el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
  el.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  el.style.transform = `perspective(1000px) rotateX(${(dy / yc) * -12}deg) rotateY(${(dx / xc) * 12}deg) scale3d(1.03, 1.03, 1.03)`;
}

function resetMouse(el) {
  el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
}

// ─── NAV ACTIVE STATE ───
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('nav ul li a');
const navContainer = document.querySelector('nav');
const menuToggle = document.getElementById('menu-toggle');

// Toggle do Menu Mobile
menuToggle?.addEventListener('click', () => {
  navContainer.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-terminal');
  icon.classList.toggle('fa-code-branch');
});

// Fecha o menu ao clicar em um link
navAs.forEach(link => {
  link.addEventListener('click', () => {
    navContainer.classList.remove('active');
    menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
  });
});

function updateNav() {
  let curr = "";
  secs.forEach(s => { if(window.scrollY >= s.offsetTop - 150) curr = s.id; });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${curr}` ? 'var(--gold)' : '';
  });
  renderValidatedSkills();
  
  // Lógica de Quest Log (Notificação ao entrar em seção)
  if (curr && quests[curr]) {
    completeQuest(curr);
  }

  // Controle de visibilidade do HUD
  const hud = document.getElementById('main-hud');
  if (hud) {
    if (window.scrollY > 200 && window.innerWidth > 850) {
      hud.classList.add('hud-visible');
    } else {
      hud.classList.remove('hud-visible');
    }
  }
}
window.addEventListener('scroll', updateNav);
window.addEventListener('load', updateNav);

// ─── KONAMI CODE EASTER EGG ───
const KK=[38,38,40,40,37,39,37,39,66,65];
let kki=0;
document.addEventListener('keydown',e=>{
  if(e.keyCode===KK[kki]) kki++; else kki=0;
  if(kki===KK.length){kki=0;openEgg()}
});
/**
 * Exibe o modal do Easter Egg (Konami Code).
 */
function openEgg(){document.getElementById('egg-modal').classList.add('show')}
/**
 * Oculta o modal do Easter Egg.
 */
function closeEgg(){document.getElementById('egg-modal').classList.remove('show')}

// ─── CYBER INTELLIGENCE (IP & GEO) ───
async function fetchIntelligence() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('API Rate Limit');
    const data = await res.json();
    const ipEl = document.getElementById('hud-ip');
    
    // Fallback caso a cidade venha vazia ou indefinida
    const city = data.city || "Unknown Location";
    if(ipEl) ipEl.innerText = `${data.ip} (${city})`;
    return data;
  } catch (e) { 
    const ipEl = document.getElementById('hud-ip');
    if(ipEl) ipEl.innerText = "SECURE_CONNECTION"; // Mensagem estilizada para erro
    return null; 
  }
}
fetchIntelligence();

// ─── HANGAR LOGIC ───
function toggleHangar() {
  document.getElementById('hangar-modal').classList.toggle('active');
}

// ─── SAO MENU LOGIC ───
function toggleSAOMenu() {
  const menu = document.getElementById('sao-menu');
  const isOpening = !menu.classList.contains('active');
  menu.classList.toggle('active');
  if (isOpening) playSAOSound();
}

function toggleQuestLog() {
  const modal = document.getElementById('quest-modal');
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) {
    renderAchievements();
    playSAOSound();
  }
}

// Placeholder para evitar erro de execução no terminal
function toggleHackerAudio(isActive) {
  if (!audioCtx) setupAudioNodes();
  if (isActive) appendLine("Protocolo de áudio hacker carregado.", "var(--red)");
  else appendLine("Áudio normal restaurado.", "var(--teal)");
}

// ─── SAO NOTIFICATION SYSTEM ───
function saoNotify(message) {
  const container = document.getElementById('sao-notifications');
  if (!container) return;
  const notif = document.createElement('div');
  notif.className = 'sao-notif';
  notif.innerHTML = `<i class="fas fa-info-circle" style="margin-right:10px"></i> ${message}`;
  container.appendChild(notif);
  setTimeout(() => {
    notif.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}

// ─── VAULT LOGIC ───
function toggleVault() {
  document.getElementById('vault-modal').classList.toggle('active');
  if(document.getElementById('vault-modal').classList.contains('active')) appendLine("Acesso ao Vault autorizado.", "var(--teal)");
}

// ─── POWER MONITOR (BATTERY API) ───
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    const updateBattery = () => {
      const pwrEl = document.getElementById('hud-pwr');
      if(pwrEl) pwrEl.innerText = `${Math.round(battery.level * 100)}% ${battery.charging ? '⚡' : ''}`;
    };
    battery.addEventListener('levelchange', updateBattery);
    battery.addEventListener('chargingchange', updateBattery);
    updateBattery();
  });
}

// ─── LOFI CONTROL ───
const lofiAudio = document.getElementById('background-lofi');
const lofiToggle = document.getElementById('lofi-toggle');
const lofiIcon = lofiToggle.querySelector('i');
const hudViz = document.getElementById('hud-viz');
const volSlider = document.getElementById('vol-slider');
const lofiContainer = document.querySelector('.lofi-player-container');

let currentFade = null; // Armazena o intervalo de fade atual
lofiAudio.volume = 0.02; 
let lastVolume = 0.1; // Volume padrão para quando desmutar

let audioCtx, source, filter;

const setupAudioNodes = () => {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  source = audioCtx.createMediaElementSource(lofiAudio);
  filter = audioCtx.createBiquadFilter();
  
  filter.type = "highpass";
  filter.frequency.value = 100; // Começa sem filtrar quase nada
  
  // Roteamento: Fonte -> Filtro -> Destino (Auto-falantes)
  source.connect(filter);
  filter.connect(audioCtx.destination);
};

/**
 * Intensifica o efeito de rádio antigo conforme o volume diminui.
 * Volume alto (1.0) = 100Hz (Som limpo)
 * Volume baixo (0.0) = 2500Hz (Som de rádio de pilha)
 */
const applyLofiFilter = (volume) => {
  if (!filter || !audioCtx) return;
  const freq = 2500 - (Math.pow(volume, 1/3) * 2400);
  filter.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
};

// Engine de Som Mecânico (Sintetizado)
const playClick = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(150 + Math.random()*50, audioCtx.currentTime);
  g.gain.setValueAtTime(0.005, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
};

// Engine de Som SAO (Chime de Cristal Sintetizado)
const playSAOSound = () => {
  if (!audioCtx) setupAudioNodes();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  const notes = [880, 1318.51, 1760]; // Notas A5, E6, A6 (Harmonia brilhante)
  
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + (i * 0.05));
    g.gain.setValueAtTime(0, now + (i * 0.05));
    g.gain.linearRampToValueAtTime(0.05, now + (i * 0.05) + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.05) + 0.5);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(now + (i * 0.05)); osc.stop(now + (i * 0.05) + 0.5);
  });
};

// Engine de Som de Erro (Bebop/SAO Alert)
const playErrorSound = () => {
  if (!audioCtx) setupAudioNodes();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.3);
  g.gain.setValueAtTime(0.05, now);
  g.gain.linearRampToValueAtTime(0, now + 0.3);
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start(); osc.stop(now + 0.3);
};

// Som de Item/Bounty (Brilho metálico)
const playItemSound = () => {
  if (!audioCtx) setupAudioNodes();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.frequency.setValueAtTime(1500, now);
  osc.start(); osc.stop(now + 0.05);
};

// ─── SAO OVERLAY EFFECTS ───
function saoAnnouncement(text) {
  const overlay = document.getElementById('sao-announcement-overlay');
  overlay.innerHTML = `<div class="sao-ann-box">${text}</div>`;
  playSAOSound();
  setTimeout(() => overlay.innerHTML = '', 5000);
}

function triggerWarning() {
  const warn = document.getElementById('sao-warning-overlay');
  warn.style.display = 'flex';
  playErrorSound();
  setTimeout(() => warn.style.display = 'none', 3000);
}

function showWantedPoster(name = "PEDRO AUGUSTO") {
  const overlay = document.getElementById('wanted-overlay');
  overlay.innerHTML = `
    <div class="wanted-content">
      <div class="wanted-header">WANTED</div>
      <div class="wanted-dead">DEAD OR ALIVE</div>
      <div class="wanted-photo"><i class="fas fa-user-secret"></i></div>
      <div class="wanted-name">${name.toUpperCase()}</div>
      <div class="wanted-reward">$$ 25,000,000</div>
    </div>
  `;
  overlay.style.display = 'flex';
  completeQuest('wanted');
}

// Engine de Som Level Up (Sintetizado - Estilo SAO/Triumphant)
const playLevelUpSound = () => {
  if (!audioCtx) setupAudioNodes();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  // Arpejo ascendente (C5 até C7)
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; 
  
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now + (i * 0.08));
    g.gain.setValueAtTime(0, now + (i * 0.08));
    g.gain.linearRampToValueAtTime(0.06, now + (i * 0.08) + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.08) + 0.8);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(now + (i * 0.08)); osc.stop(now + (i * 0.08) + 0.8);
  });
};

function updateAudioVisualizer() {
  const miniViz = document.getElementById('mini-viz');
  if (lofiAudio.paused) {
    hudViz?.classList.remove('active');
    miniViz?.classList.remove('active');
    lofiContainer?.classList.add('is-paused');
  } else {
    hudViz?.classList.add('active');
    miniViz?.classList.add('active');
    lofiContainer?.classList.remove('is-paused');
  }
}

// O áudio é bloqueado pelos navegadores até que o usuário clique em algo.
// Esta função inicia o áudio no primeiro clique detectado no documento.
const startAudioOnInteraction = () => {
  setupAudioNodes();
  lofiAudio.play().then(() => {
    lofiIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    updateAudioVisualizer();
    document.removeEventListener('click', startAudioOnInteraction);
  }).catch(() => {});
};
document.addEventListener('click', startAudioOnInteraction);

function updateVolumeIcon(val) {
  if (val === 0) lofiIcon.className = 'fas fa-volume-mute';
  else if (val < 0.5) lofiIcon.className = 'fas fa-volume-down';
  else lofiIcon.className = 'fas fa-volume-up';
}

/**
 * Mapeamento Logarítmico de Volume.
 * Para resolver a sensibilidade, usamos uma curva de potência (x^2).
 * Isso dá muito mais precisão nos volumes baixos.
 */
volSlider?.addEventListener('input', (e) => {
  const sliderVal = e.target.value / 100;
  const curvedVolume = Math.pow(sliderVal, 3); // Curva cúbica: resolve a sensibilidade excessiva
  
  lofiAudio.volume = curvedVolume;
  if (curvedVolume > 0) lastVolume = curvedVolume;
  
  updateVolumeIcon(curvedVolume);
  updateAudioVisualizer();
  applyLofiFilter(curvedVolume);
  if (lofiAudio.paused && curvedVolume > 0) {
    lofiAudio.play();
  }
});

/**
 * Executa uma transição suave de volume (Fade).
 * @param {number} target - Volume final (0 a 1).
 * @param {number} duration - Duração em milissegundos.
 */
function fadeVolume(target, duration = 600) {
  if (currentFade) clearInterval(currentFade);
  
  const startVol = lofiAudio.volume;
  const diff = target - startVol;
  const steps = 30;
  const stepTime = duration / steps;
  let currentStep = 0;

  currentFade = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const nextVol = startVol + (diff * progress);
    
    lofiAudio.volume = Math.max(0, Math.min(1, nextVol));
    
    // Atualiza o slider visualmente durante o fade usando a curva cúbica inversa
    if (volSlider) volSlider.value = Math.pow(lofiAudio.volume, 1/3) * 100;
    
    updateVolumeIcon(lofiAudio.volume);
    updateAudioVisualizer();
    applyLofiFilter(lofiAudio.volume);

    if (currentStep >= steps) {
      clearInterval(currentFade);
      currentFade = null;
      if (lofiAudio.volume <= 0.001) lofiAudio.pause();
    }
  }, stepTime);
}

lofiToggle?.addEventListener('click', (e) => {
  e.stopPropagation(); // Evita que o clique no botão ative o carregamento automático global ao mesmo tempo
  
  if (lofiAudio.volume > 0) {
    lastVolume = lofiAudio.volume;
    fadeVolume(0, 800); // Fade out suave de 800ms
  } else {
    if (lofiAudio.paused) lofiAudio.play();
    fadeVolume(lastVolume, 600); // Fade in suave de 600ms
  }
});

// Simulação de Banco de Dados NoSQL (MongoDB Style)
const mockDB = {
  async connect() {
    appendLine("Conectando ao MongoDB Atlas Cluster-0...", "var(--gold)");
    return new Promise(r => setTimeout(r, 1000));
  },
  async find(collection) {
    appendLine(`db.${collection}.find({})`, "var(--teal)");
    const data = {
      visitors: [{id: 1, role: "Recruiter", access: "Granted"}],
      projects: [{name: "Bebop-Port", status: "Production"}]
    };
    return data[collection] || [];
  }
};

// ─── INTERACTIVE TERMINAL ───
const termInput = document.getElementById('terminal-input');
const termHistory = document.getElementById('terminal-history');

// Focar no terminal ao clicar na área dele (substitui o autofocus que causava o pulo da página)
document.querySelector('.terminal')?.addEventListener('click', () => {
  termInput.focus();
});

const appendLine = (text, color = 'var(--cream)', isHtml = false) => {
  const line = document.createElement('div');
  line.className = 't-line';
  if (isHtml) {
    line.innerHTML = `<span class="t-cmd">></span> <span style="color:${color}">${text}</span>`;
  } else {
    const span = document.createElement('span');
    span.style.color = color;
    span.textContent = text;
    line.innerHTML = `<span class="t-cmd">></span> `;
    line.appendChild(span);
  }
  termHistory.appendChild(line);
  const body = termInput.closest('.terminal-body');
  body.scrollTop = body.scrollHeight;
};

const decryptEffect = (targetText, color = 'var(--cream)') => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
  let iteration = 0;
  const line = document.createElement('div');
  line.className = 't-line';
  line.innerHTML = `<span class="t-cmd">></span> <span style="color:${color}"></span>`;
  termHistory.appendChild(line);
  const span = line.querySelector('span:last-child');
  
  const interval = setInterval(() => {
    span.innerText = targetText.split("").map((char, index) => {
      if(index < iteration) return targetText[index];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    if(iteration >= targetText.length) clearInterval(interval);
    iteration += 1 / 3;
  }, 30);
};

const commands = {
  ls: "projetos/  certificados/  curriculo.pdf  contato.txt",
  about: "Pedro Augusto Floriano, 18 anos, Sorocaba/SP. Técnico em Eletrônica e Cibersegurança focado em proteção de sistemas e hardware.",
  skills: "Cyber: Pentesting (Nmap, Burp), SOC, Networking (TCP/IP), Linux (Hardening). | Eletrônica: MCU, PCB Design, Automação.",
  contact: "Email: florianop2008@gmail.com | LinkedIn: linkedin.com/in/pedro-augusto-floriano",
  social: "Ações: Arrecadação ETEC, Apoio RS (Enchentes), Doador de Sangue frequente.",
  badges: "Certificações: Ethical Hacker, Network Technician, Cyber Threat Management, Network Support.",
  neofetch: "Exibe informações técnicas do sistema e do usuário.",
  clear: "Limpa o histórico de comandos do terminal.",
  weather: "Consulta dados atmosféricos em tempo real via satélite.",
  scan: "Executa varredura profunda de integridade do sistema.",
  "download cv": "Inicia transferência segura do currículo em PDF.",
  audit: "Gera um relatório de conformidade do Cardinal System.",
  cat: "Lê o conteúdo de um arquivo (Ex: cat intel_report.txt).",
  top: "Monitora os processos ativos do Bebop-OS.",
  "link-start": "Inicializa mergulho neural no servidor Aincrad.",
  "system-call": "Executa comando de autoridade no Cardinal System.",
  inventory: "Exibe a lista de equipamentos e itens de sistema.",
  stacia: "Alterna privilégios de visualização de deidade (Admin Mode).",
  ssh: "Estabelece conexão com servidores remotos (Ex: ssh root@bebop).",
  db: "Acesso ao banco de dados NoSQL (Ex: db projects).",
  whois: "Executa rastreio de pacotes e geolocalização de IP.",
  hack: "Ativa o protocolo de override e alerta do sistema.",
  matrix: "Ativa o modo visual de chuva digital (Digital Rain).",
  exit: "Encerra sessões ativas ou processos em execução.",
  audit: "Iniciando varredura de vulnerabilidades...",
  "sudo self-destruct": "Protocolo de emergência final. CUIDADO."
};

// Gera o comando HELP dinamicamente com base nas chaves do objeto
commands.help = "Comandos: " + Object.keys(commands).join(', ') + ". Use Tab para completar.";

// Texto do Neofetch (Mantido fora do objeto para não poluir o help dinâmico com strings gigantes)
const neofetchData = `<span>PAF-OS v1.0.0</span><br>
<span>-----------</span><br>
<span>OS: Linux / Bebop-Kernel</span><br>
<span>Uptime: 18 years, 3 months</span><br>
<span>Shell: zsh 5.8</span><br>
<span>CPU: Pedro Augusto @ 4.2GHz</span><br>
<span>Memory: 16GB / 32GB</span>`;

const virtualFiles = {
  "intel_report.txt": "CLASSIFIED: Alvo identificado em Sorocaba, SP. Nível de ameaça: Engenheiro de Software Sênior.",
  "contato.txt": "Email: florianop2008@gmail.com\nLinkedIn: pedro-augusto-floriano\nStatus: Disponível para contratação.",
  "curriculo.pdf": "[BINARY_DATA] Use o comando 'download cv' para descriptografar."
};

// ─── PERSISTENT TERMINAL HISTORY ───
let cmdHistory = JSON.parse(localStorage.getItem('term_history') || "[]");
let historyIdx = -1;

document.addEventListener('keydown', (e) => {
  if(e.key.toLowerCase() === 'm' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    toggleSAOMenu();
  }
});

termInput?.addEventListener('keydown', (e) => {
  if(e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') playClick();
  
  // Tab Autocomplete
  if (e.key === 'Tab') {
    e.preventDefault();
    const currentInput = termInput.value.toLowerCase();
    if (currentInput.length > 0) {
      const match = Object.keys(commands).find(c => c.startsWith(currentInput));
      if (match) termInput.value = match;
    }
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
      historyIdx++;
      termInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIdx > 0) {
      historyIdx--;
      termInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
    } else {
      historyIdx = -1;
      termInput.value = '';
    }
  }

  if (e.key === 'Enter') {
    const val = termInput.value.toLowerCase().trim();
    if (val !== "") {
      cmdHistory.push(val);
      localStorage.setItem('term_history', JSON.stringify(cmdHistory.slice(-20))); // Salva os últimos 20
      historyIdx = -1;
      
      // Achievement System para Comandos (Extrai o primeiro nome do comando)
      const baseCmd = val.split(' ')[0];
      if (quests[baseCmd]) completeQuest(baseCmd);
    }

    const line = document.createElement('div');
    line.className = 't-line';
    
    if (val === 'clear') {
      termHistory.innerHTML = '';
    } else if (val === 'scan' && document.body.classList.contains('emergency-mode')) {
        appendLine("Iniciando purga de sistema...", "var(--teal)");
        setTimeout(resolveEmergency, 2000);
    } else if (val === 'audit') {
        appendLine("Requisitando SecurityAuditService via API...", "var(--gold)");
        setTimeout(() => {
            decryptEffect("[REPORT-2025] STATUS: STABLE | COMPLIANCE: 100%", "var(--teal)");
            addSecurityLog("Audit report generated by PAF-OS", "log-warn");
        }, 1200);
    } else if (val === 'samba') {
      document.body.classList.toggle('samba-active');
      appendLine("MUSHROOM_SAMBA: PROTOCOLO ATIVADO. BOA VIAGEM.", "var(--gold)");
      completeQuest('samba');
    } else if (val === 'gate') {
      appendLine("Entrando no Portão Hiperespacial. Segure-se.", "var(--cyan)");
      completeQuest('gate');
      
      // Ativa o tremor de tela por 600ms
      document.body.classList.add('gate-shake');
      setTimeout(() => document.body.classList.remove('gate-shake'), 600);

      document.body.classList.add('gate-active');
      particles.forEach(p => { p.vx *= 50; p.vy *= 50; });
      setTimeout(() => {
        particles.forEach(p => { p.vx /= 50; p.vy /= 50; });
        document.body.classList.remove('gate-active');
        saoAnnouncement("HYPERSPACE EXIT: NORMAL");
      }, 3000);
    } else if (val.startsWith('wanted')) {
      const name = val.replace('wanted', '').trim();
      showWantedPoster(name || undefined);
      appendLine("Gerando cartaz de recompensa via ISSSP...", "var(--gold)");
    } else if (val === 'link-start') {
      const overlay = document.createElement('div');
      overlay.className = 'link-start-overlay';
      document.body.appendChild(overlay);
      appendLine("NerveGear: INITIALIZING...", "var(--gold)");
      setTimeout(() => appendLine("BURST LINK ESTABLISHED", "var(--teal)"), 500);
      setTimeout(() => appendLine("WELCOME TO AINCRAD, PEDRO.", "var(--cream)"), 1000);
      setTimeout(() => overlay.remove(), 1000);
    } else if (val === 'menu') {
      toggleSAOMenu();
      appendLine("Abrindo interface de usuário flutuante...", "var(--teal)");
    } else if (val === 'system-call inspect') {
      appendLine("Cardinal System: Analisando integridade do ambiente...", "var(--gold)");
      setTimeout(() => {
        appendLine("OBJECT_ID: [PEDRO_FLORIANO_USER]", "var(--teal)");
        appendLine("STATUS: IMMORTAL_OBJECT (ADMIN_PRIVILEGES)", "var(--red)");
      }, 1000);
    } else if (val === 'stacia') {
      document.body.classList.toggle('stacia-mode');
      appendLine("SYSTEM_CALL: MODE_STACIA_" + (document.body.classList.contains('stacia-mode') ? "ON" : "OFF"), "var(--gold)");
    } else if (val === 'inventory') {
      appendLine("EQUIPMENT_LIST:", "var(--gold)");
      appendLine("[ITEM] Nmap_Scanner (Lvl 38)", "var(--cyan)");
      appendLine("[ITEM] Arduino_Core (Lvl 42)", "var(--teal)");
      appendLine("[SKILL] Bilingual_Logic (Active)", "var(--cream)");
    } else if (val.startsWith('cat ')) {
      const fileName = val.split(' ')[1];
      if (virtualFiles[fileName]) {
        decryptEffect(virtualFiles[fileName], "var(--cream)");
      } else {
        appendLine(`Erro: Arquivo '${fileName}' não encontrado ou corrompido.`, "var(--red)");
      }
    } else if (val === 'top') {
      appendLine("PID  USER   COMMAND       CPU%  MEM%", "var(--gold)");
      appendLine("101  root   Swordfish_II  12.4  4.2", "var(--teal)");
      appendLine("102  spike  Jazz_Player   2.1   1.8", "var(--teal)");
      appendLine("103  pedro  Portfolio_v1  45.8  8.4", "var(--teal)");
      appendLine("104  ed     Hacker_Tool   89.1  12.3", "var(--red)");
    } else if (val === 'sudo self-destruct') {
      appendLine("PROTOCOL_ALPHA_REDACTED: AUTODESTRUIÇÃO EM 5 SEGUNDOS.", "var(--red)");
      document.body.classList.add('destruct-active');
      let count = 5;
      const timer = setInterval(() => {
        count--;
        if(count > 0) {
          appendLine(`T-MINUS ${count}...`, "var(--red)");
        } else {
          clearInterval(timer);
          appendLine("GOODBYE, SPACE COWBOY.", "var(--cream)");
          setTimeout(() => {
            localStorage.clear();
            location.reload();
          }, 1000);
        }
      }, 1000);
    } else if (val === 'weather') {
      appendLine("Acessando satélite de observação...", "var(--gold)");
      fetchIntelligence().then(geo => {
        if(!geo) return appendLine("Erro: Falha na telemetria GPS.", "var(--red)");
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current_weather=true`)
          .then(r => r.json())
          .then(w => {
            const temp = w.current_weather.temperature;
            const code = w.current_weather.weathercode;
            appendLine(`LOCALIZAÇÃO: ${geo.city}, ${geo.region}`, "var(--teal)");
            appendLine(`CONDIÇÃO: ${temp}°C / Status Code: ${code}`, "var(--cream)");
            if(temp > 30) appendLine("ALERTA: Alta radiação térmica detectada.", "var(--red)");
          });
      });
    } else if (val === 'scan') {
      const scanLine = document.getElementById('scan-line');
      scanLine.classList.add('scanning');
      appendLine("Iniciando Deep Scan...", "var(--teal)");
      setTimeout(() => appendLine("Analisando integridade de pacotes...", "var(--cream)"), 500);
      setTimeout(() => appendLine("Verificando assinaturas digitais...", "var(--cream)"), 1200);
      setTimeout(() => {
        scanLine.classList.remove('scanning');
        appendLine("Varredura concluída. 0 vulnerabilidades encontradas.", "var(--teal)");
        addSecurityLog("System Integrity Check: PASSED", "log-warn");
      }, 2000);
    } else if (val === 'download cv') {
      appendLine("Iniciando transferência de 'curriculo_paf.pdf'...", "var(--gold)");
      const progId = 'prog-' + Date.now();
      appendLine(`<div class="t-progress-wrap"><div id="${progId}" class="t-progress-fill"></div></div> <span id="${progId}-val">0%</span>`, "var(--teal)", true);
      let p = 0;
      const int = setInterval(() => {
        p += Math.random() * 15;
        if (p >= 100) {
          p = 100;
          clearInterval(int);
          appendLine("Transferência completa. Abrindo documento...", "var(--teal)");
          window.open('curriculo.pdf', '_blank'); // Assume o arquivo existe
        }
        document.getElementById(progId).style.width = p + '%';
        document.getElementById(progId + '-val').innerText = Math.floor(p) + '%';
      }, 150);
    } else if (val === 'ssh root@bebop') {
      appendLine("Estabelecendo túnel SSH encriptado...", "var(--gold)");
      setTimeout(() => {
        termHistory.innerHTML = '';
        appendLine("CONECTADO: root@bebop_vessel", "var(--teal)");
        appendLine("Sistemas de propulsão: NOMINAL", "var(--cream)");
        appendLine("Localização atual: Órbita de Marte", "var(--cream)");
        appendLine("Digite 'exit' para retornar ao shell local.", "var(--muted)");
      }, 1500);
    } else if (val === 'exit') {
      termHistory.innerHTML = '';
      appendLine("Conexão encerrada. Retornando ao host local...", "var(--gold)");
    } else if (val.startsWith('db ')) {
      const col = val.split(' ')[1];
      mockDB.connect().then(() => mockDB.find(col)).then(res => {
        appendLine(JSON.stringify(res, null, 2), "var(--cream)");
      });
    } else if (val === 'whois') {
      appendLine("Rastreando origem da conexão...", "var(--gold)");
      fetchIntelligence().then(data => {
        if(data) {
          appendLine(`IP: ${data.ip} | Org: ${data.org} | Loc: ${data.city}/${data.region}`, "var(--teal)");
        }
      });
    } else if (val === 'audit' || val === 'hack' || val === 'matrix') {
      if (val === 'hack' || val === 'matrix') {
        document.body.classList.toggle('hacking-mode');
        const isHacking = document.body.classList.contains('hacking-mode');
        appendLine("SISTEMA_OVERRIDE: MODO " + (isHacking ? "ATIVADO" : "DESATIVADO"), "var(--red)");
        toggleHackerAudio(document.body.classList.contains('hacking-mode'));
        
        if(val === 'matrix') {
          mCanvas.style.display = isHacking ? 'block' : 'none';
          if(isHacking) {
            initMatrix();
            matrixInterval = setInterval(drawMatrix, 33);
          } else {
            clearInterval(matrixInterval);
          }
        }
      }
      decryptEffect("Nmap scan report for internal_network (192.168.1.1)...", "var(--teal)");
      setTimeout(() => appendLine("PORT 80/TCP OPEN [HTTP]", "var(--gold)"), 500);
      setTimeout(() => appendLine("PORT 22/TCP OPEN [SSH]", "var(--gold)"), 1000);
      setTimeout(() => appendLine("Injetando scripts de bypass...", "var(--red)"), 1500);
      setTimeout(() => {
        appendLine("Relatório gerado: Nenhuma vulnerabilidade crítica encontrada.", "var(--teal)");
      }, 3000);
    } else if (val === 'neofetch') {
      appendLine(neofetchData, 'var(--gold)', true);
    } else if (commands[val]) {
      appendLine(commands[val], val === 'ls' ? 'var(--cyan)' : 'var(--cream)');
    } else if (val !== "") {
      appendLine(`Erro: Comando '${val}' não reconhecido.`, "var(--red)");
    }
    
    termInput.value = '';
    // Auto-scroll para o final
    const body = termInput.closest('.terminal-body');
    body.scrollTop = body.scrollHeight;
  }
});

// ─── SECURITY LOG GENERATOR ───
const logPool = [
  {t: "SSH attempt blocked: user 'admin'", c: "log-warn"},
  {t: "Inbound packet dropped from 103.21.x.x", c: ""},
  {t: "SQL Injection signature detected", c: "log-crit"},
  {t: "Buffer overflow prevented in memory offset 0x4F", c: "log-crit"},
  {t: "File integrity check: OK", c: ""},
  {t: "New connection established to gateway", c: ""},
  {t: "Cryptographic handshake complete", c: "log-warn"}
];

function addSecurityLog(text = null, className = null) {
  const logWrap = document.getElementById('hud-logs');
  if(!logWrap) return;
  const log = text ? {t: text, c: className} : logPool[Math.floor(Math.random() * logPool.length)];
  const el = document.createElement('div');
  el.className = `log-line ${log.c || ''}`;
  el.innerText = `[${new Date().toLocaleTimeString()}] ${log.t}`;
  logWrap.prepend(el);
  if(logWrap.children.length > 5) logWrap.lastElementChild.remove();
}

setInterval(() => addSecurityLog(), 4000);

// ─── QUICK COPY EMAIL ───
function copyEmail() {
  const email = "florianop2008@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const text = document.getElementById('email-text');
    const original = text.innerText;
    text.innerText = "E-mail copiado!";
    text.style.color = "var(--teal)";
    setTimeout(() => {
      text.innerText = original;
      text.style.color = "";
    }, 2000);
  });
}

// ─── HUD UPDATER ───
let currentTemp = 38.5; // Temperatura base
const uptimeStart = Date.now();
const cpuHistory = Array(20).fill(0);
let stamina = 100;
let lastScrollPos = window.scrollY;

function drawCpuGraph(load) {
  const gCanvas = document.getElementById('cpu-graph');
  if(!gCanvas) return;
  const gCtx = gCanvas.getContext('2d');
  cpuHistory.push(load);
  cpuHistory.shift();
  gCtx.clearRect(0,0,100,20);
  gCtx.strokeStyle = '#06ffa5';
  gCtx.beginPath();
  cpuHistory.forEach((val, i) => {
    const x = i * 5;
    const y = 20 - (val / 100 * 20);
    i === 0 ? gCtx.moveTo(x, y) : gCtx.lineTo(x, y);
  });
  gCtx.stroke();
}

// ─── FLOOR TRACKER ───
function updateFloor() {
  const secs = document.querySelectorAll('section[id]');
  let currentFloor = 1;
  secs.forEach((s, i) => {
    if(window.scrollY >= s.offsetTop - 300) currentFloor = i + 1;
  });
  const floorEl = document.getElementById('hud-floor');
  if(floorEl) floorEl.innerText = currentFloor.toString().padStart(2, '0');
}

// ─── RTC UPDATER ───
function updateRTC() {
  const rtcEl = document.getElementById('hud-rtc');
  const satEl = document.getElementById('hud-sat');
  const now = new Date();
  if(rtcEl) {
    const d = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const t = now.toLocaleTimeString('pt-BR', { hour12: false });
    rtcEl.innerText = `${d} ${t}`;
  }
  if(satEl && Math.random() > 0.95) satEl.innerText = "RE-SYNCING..."; else if(satEl) satEl.innerText = "STABLE";
}
setInterval(updateRTC, 1000);
updateRTC();

setInterval(() => {
  // Cálculo de CPU: Tempo gasto processando / Tempo total disponível (16.6ms por frame a 60fps)
  // Multiplicamos por um fator de escala para dar uma leitura realista de "uso de thread"
  const avgExecutionTime = frameExecutionTime / lastFrameTimestamp;
  const cpuLoad = Math.min(99.9, (avgExecutionTime / 16.6) * 100 * 5).toFixed(1);
  
  // Simulação Térmica: A temperatura sobe com a CPU e tende a esfriar em repouso
  const targetTemp = 35 + (parseFloat(cpuLoad) * 0.4);
  currentTemp += (targetTemp - currentTemp) * 0.1; // Suavização (Inércia térmica)
  
  const cpuEl = document.getElementById('hud-cpu');
  const tempEl = document.getElementById('hud-temp');
  const memEl = document.getElementById('hud-mem');
  const diskEl = document.getElementById('hud-disk');
  const uptimeEl = document.getElementById('hud-uptime');
  
  if(cpuEl) cpuEl.innerText = `${cpuLoad}%`;
  drawCpuGraph(parseFloat(cpuLoad));
  updateFloor(); 
  renderAchievements();
  if(tempEl) tempEl.innerText = `${currentTemp.toFixed(1)}°C`;
  
  // Simulação de Disk I/O baseada em atividade de rede/logs
  if(diskEl) {
    const isActive = Math.random() > 0.7;
    diskEl.innerText = isActive ? (Math.random() * 50).toFixed(1) + "MB/s" : "IDLE";
    diskEl.style.color = isActive ? "var(--teal)" : "var(--muted)";
  }
  
  // Uptime Calculation
  const diff = Math.floor((Date.now() - uptimeStart) / 1000);
  const m = Math.floor(diff / 60).toString().padStart(2, '0');
  const s = (diff % 60).toString().padStart(2, '0');
  if(uptimeEl) uptimeEl.innerText = `${m}:${s}`;

  if(performance.memory && memEl) {
    const usedMem = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
    memEl.innerText = `${usedMem}MB`;
  }
  
  // Reset para o próximo ciclo de amostragem
  frameExecutionTime = 0;
  lastFrameTimestamp = 0;
}, 2000);

// Anti-Tamper: Detecta abertura do DevTools
let devToolsOpen = false;
const threshold = 160;
setInterval(() => {
  if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
    if(!devToolsOpen) appendLine("ALERTA: Inspeção de código detectada. Firewall ativado.", "var(--red)");
    devToolsOpen = true;
  } else { devToolsOpen = false; }
}, 2000);

// Medição real de latência
setInterval(async () => {
  const start = Date.now();
  try {
    await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
    const netEl = document.getElementById('hud-net');
    if(netEl) netEl.innerText = `${Date.now() - start}ms`;
  } catch(e) { /* Offline */ }
}, 5000);