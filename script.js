// Garante que a página abra no topo ao carregar ou atualizar
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

// Estados Globais de Sistema
let systemThreatLevel = 0;
const THREAT_THRESHOLD = 85;
window.playerPowerBoost = 0; // Inicializa o boost de poder global
window.playerCritChance = 5; // Chance crítica inicial (%)
window.playerMaxHP = 100; // HP máximo inicial
let lastLevel = 1; // Rastreador de nível para eventos de Level Up
let playerWoolongs = 0; // Saldo inicial de moedas
let playerSyncRate = 100; // Sincronização neural global
let isBurstLinkActive = false;
let duelDeflected = false;
let playerSP = 100;
let currentCombatState = null;

/* Configurações de Cooldown */
let burstCooldownActive = false;
let burstCooldownPercent = 0;

const rarityColors = {
    "COMMON": "var(--muted)",
    "RARE": "var(--cyan)",
    "LEGENDARY": "var(--gold)",
    "MYTHIC": "var(--red)",
    "ULTIMATE": "var(--teal)"
};

const networkDevices = [
    { ip: "10.0.0.1", name: "GATEWAY_BEBOP", status: "SECURE", reward: 0 },
    { ip: "10.0.0.42", name: "SWORDFISH_II_AVIONICS", status: "VULNERABLE", reward: 2500 },
    { ip: "192.168.1.10", name: "CARDINAL_CORE", status: "ENCRYPTED", reward: 0 },
    { ip: "172.16.0.5", name: "SYNDICATE_LISTENER", status: "SUSPICIOUS", reward: 5000 }
];

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

// ─── CARDINAL AI INTERJECTIONS ───
const cardinalComments = [
    "Cardinal: Analisando integridade neural...",
    "Bebop-OS: Sincronização estável com o setor 7.",
    "Aviso: Nível de ameaça 'S-Rank' detectado nos arredores.",
    "Cardinal System: Monitorando progresso do jogador...",
    "Bebop: See you space cowboy..."
];
setInterval(() => {
    if (Math.random() > 0.8 && !currentCombatState) {
        addSecurityLog(cardinalComments[Math.floor(Math.random() * cardinalComments.length)], "log-warn");
    }
}, 15000);

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
    let distSq = dx*dx + dy*dy; // Uso de distância ao quadrado evita Math.sqrt (caro)
    if(distSq < 10000){ // 100^2
      let force = (100 - Math.sqrt(distSq)) / 100;
      this.x -= dx * force * 0.05;
      this.y -= dy * force * 0.05;
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
  { name: "Conceptual Thinking", url: "https://www.credly.com/skills/conceptual-thinking" },
  { name: "Course Evaluations", url: "https://www.credly.com/skills/course-evaluations" },
  { name: "Data Cleansing", url: "https://www.credly.com/skills/data-cleansing" },
  { name: "Data Visualization", url: "https://www.credly.com/skills/data-visualization" },
  { name: "Explanatory Mechanisms", url: "https://www.credly.com/skills/explanatory-mechanisms"},
  { name: "Exploratory Data Analysis", url: "https://www.credly.com/skills/exploratory-data-analysis" },
  { name: "Giving Presentations", url: "https://www.credly.com/skills/giving-presentations" },
  { name: "GRE", url: "https://www.credly.com/skills/gre" },
  { name: "Information Sciences", url: "https://www.credly.com/skills/information-sciences" },
  { name: "Jupyter Notebook", url: "https://www.credly.com/skills/jupyter-notebook" },
  { name: "Linear Regression", url: "https://www.credly.com/skills/linear-regression" },
  { name: "Project Management", url: "https://www.credly.com/skills/project-management" },
  { name: "Python for Data Analysis (Pandas and Matplotlib)", url: "https://www.credly.com/skills/python-for-data-analysis-pandas-and-matplotlib" },
  { name: "Student Assessment", url: "https://www.credly.com/skills/student-assessment" },
  { name: "Data Storytelling", url: "http://credly.com/skills/storytelling-with-data" },
  { name: "Thinking Processes", url: "https://www.credly.com/skills/thinking-processes" },
  { name: "Dashboard", url: "https://www.credly.com/skills/dashboard" },
  { name: "Data Analysis", url: "https://www.credly.com/skills/data-analysis" },
  { name: "Microsoft Excel", url: "https://www.credly.com/skills/excel" },
  { name: "Database Queries", url: "https://www.credly.com/skills/sql" },
  { name: "Tableau", url: "https://www.credly.com/skills/tableau" },
  { name: "Artificial Intelligence (AI)", url: "https://www.credly.com/skills/ai-applications" },
  { name: "Artificial Intelligence (AI) Capabilities", url: "https://www.credly.com/skills/ai-capabilities" },
  { name: "AI Ethics", url: "https://www.credly.com/skills/ai-ethics" },
  { name: "Artificial Neural Networks", url: "https://www.credly.com/skills/artificial-neural-networks" },
  { name: "Chatbots", url: "https://www.credly.com/skills/chatbots" },
  { name: "Computer Vision", url: "https://www.credly.com/skills/computer-vision" },
  { name: "Deep Learning", url: "https://www.credly.com/skills/deep-learning" },
  { name: "Machine Learning (ML)", url: "https://www.credly.com/skills/machine-learning" },
  { name: "Natural Language Processing (NLP)", url: "https://www.credly.com/skills/natural-language-processing" },
  { name: "IBM Watson Knowledge Studio (WKS)", url: "https://www.credly.com/skills/watson-studio" },
];

/**
 * Cria texto flutuante na tela para feedback de combate.
 */
function createFloatingText(text, color) {
    const el = document.createElement('div');
    el.innerText = text;
    el.className = 'floating-text';
    el.style.color = color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

/**
 * Regeneração passiva de SP.
 */
function regenStamina() {
    if (playerSP < 100) {
        playerSP = Math.min(100, playerSP + 1);
        const spFill = document.getElementById('sao-sp-fill');
        if (spFill) spFill.style.width = playerSP + '%';
        
        // Feedback visual para o Burst Link quando pronto
        const burstBtn = document.getElementById('burst-link-container');
        if (burstBtn) {
            if (playerSP >= 40) {
                burstBtn.classList.add('ready-to-burst');
            } else {
                burstBtn.classList.remove('ready-to-burst');
            }
        }
    }
}
setInterval(regenStamina, 2000);

/**
 * Burst Link: Efeito visual e de status que "congela" o ambiente.
 */
function triggerBurstLink() {
  if (isBurstLinkActive) return;
  if (burstCooldownActive) {
      saoNotify("SYSTEM OVERHEAT: Aguarde o resfriamento neural.", "var(--red)");
      return;
  }
  if (playerSP < 40) {
      saoNotify("SP INSUFICIENTE PARA BURST LINK", "var(--red)");
      return;
  }

  isBurstLinkActive = true;
  playerSP -= 40;
  document.body.style.filter = "grayscale(1) contrast(1.5) brightness(0.8) hue-rotate(280deg)";
  saoAnnouncement("BURST LINK: OVERCLOCKING COGNITION");
  window.playerPowerBoost += 50;
  
  const hudBtn = document.getElementById('burst-link-container');
  if(hudBtn) hudBtn.style.opacity = "0.3";

  setTimeout(() => {
    document.body.style.filter = "";
    window.playerPowerBoost -= 50;
    isBurstLinkActive = false;
    if(hudBtn) hudBtn.style.opacity = "1";
    
    // Inicia Cooldown de 20 segundos
    startBurstCooldown(20000);
  }, 10000);
}

function startBurstCooldown(duration) {
    burstCooldownActive = true;
    burstCooldownPercent = 100;
    const wrap = document.getElementById('burst-cooldown-wrap');
    const fill = document.getElementById('burst-cooldown-fill');
    if (wrap) wrap.style.display = 'block';

    const start = Date.now();
    const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        burstCooldownPercent = 100 - (elapsed / duration * 100);
        if (fill) fill.style.width = burstCooldownPercent + '%';

        if (elapsed >= duration) {
            clearInterval(interval);
            burstCooldownActive = false;
            if (wrap) wrap.style.display = 'none';
            saoNotify("BURST LINK READY", "var(--teal)");
        }
    }, 100);
}

// Atalho 'B' para Burst Link
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'b' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) triggerBurstLink();
});

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
  hero: { title: "Início da Jornada", desc: "Acesse o sistema Bebop-OS", completed: false, icon: "fa-rocket", xp: 100, woolongs: 5000 },
  sobre: { title: "Dossiê Pessoal", desc: "Leia o perfil do tripulante", completed: false, icon: "fa-user-ninja", xp: 150, woolongs: 10000 },
  habilidades: { title: "Arsenal Técnico", desc: "Analise a árvore de skills", completed: false, icon: "fa-bolt", xp: 150, woolongs: 10000 },
  certificacoes: { title: "Bounty Board", desc: "Explore o quadro de recompensas", completed: false, icon: "fa-scroll", xp: 150, woolongs: 10000 },
  experiencia: { title: "Linha do Tempo", desc: "Sincronize com o passado", completed: false, icon: "fa-hourglass-half", xp: 150, woolongs: 10000 },
  projetos: { title: "Arquiteto de Dados", desc: "Inspecione os artefatos", completed: false, icon: "fa-microchip", xp: 200, woolongs: 15000 },
  social: { title: "Impacto Local", desc: "Veja as ações sociais", completed: false, icon: "fa-heart", xp: 150, woolongs: 10000 },
  conquistas: { title: "Completionist", desc: "Acesse a galeria de troféus", completed: false, icon: "fa-trophy", xp: 100, woolongs: 5000 },
  boss_74: { title: "Gleam Eyes", desc: "Vença o Boss do 74º andar", completed: false, icon: "fa-sword", xp: 500, woolongs: 50000000 },
  boss_90: { title: "Reaper Defeated", desc: "Vença o Fatal Scythe no andar 90", completed: false, icon: "fa-ghost", xp: 1200, woolongs: 150000000 },
  boss_vicious: { title: "The Real Folk Blues", desc: "Elimine o líder do sindicato", completed: false, icon: "fa-cross", xp: 3000, woolongs: 300000000 },
  market_master: { title: "Whale", desc: "Compre todos os itens do mercado", completed: false, icon: "fa-shopping-cart", xp: 600, woolongs: 100000 },
  terminal_pro: { title: "Ghost in the Shell", desc: "Use 5 comandos diferentes no terminal", completed: false, icon: "fa-code", xp: 400, woolongs: 20000 },
  archivist: { title: "Data Miner", desc: "Use 'cat' em um arquivo secreto", completed: false, icon: "fa-file-code", xp: 250, woolongs: 5000 },
  wanted: { title: "Bounty Hunter", desc: "Gere um cartaz de procurado", completed: false, icon: "fa-user-secret", xp: 200, woolongs: 2500 },
  stacia_mode: { title: "God Mode", desc: "Ative privilégios de Stacia", completed: false, icon: "fa-crown", xp: 500, woolongs: 0 },
  konami_master: { title: "Retro Hacker", desc: "Código Konami detectado", completed: false, icon: "fa-gamepad", xp: 300, woolongs: 9999 },
  hangar_engineer: { title: "Shipwright", desc: "Inspecionou a Swordfish II", completed: false, icon: "fa-rocket", xp: 200, woolongs: 1000 },
  audio_sync: { title: "Neural Harmony", desc: "Ajustou a frequência lofi", completed: false, icon: "fa-music", xp: 150, woolongs: 500 },
}));

// Inicialização de atributos baseada no progresso salvo
const initialXP = Object.values(quests).filter(q => q.completed).reduce((sum, q) => sum + (q.xp || 100), 0);
lastLevel = Math.floor(initialXP / 250) + 1;
window.playerMaxHP = 100 + (lastLevel - 1) * 25;

let allQuestsCompletedSoundPlayed = Object.values(quests).every(q => q.completed);
function saveQuests() { localStorage.setItem('achievements_paf', JSON.stringify(quests)); }

function completeQuest(id) {
  if (quests[id] && !quests[id].completed) {
    quests[id].completed = true;
    const reward = quests[id].woolongs || 0;
    playerWoolongs += reward;
    saoNotify(`QUEST COMPLETE: ${quests[id].title} (+${reward.toLocaleString()} ₩)`);
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
  { id: "SW-01", name: "Plasma Cannon [Mk.I]", type: "HARDWARE", cost: 500000, power: 15.5, rarity: "RARE" },
  { id: "SAO-EL", name: "Elucidator [Carbon Steel]", type: "COMBAT", cost: 1200000, power: 25.0, rarity: "LEGENDARY" },
  { id: "SEC-BR", name: "Kernel Bypass Rootkit", type: "SECURITY", cost: 300000, power: 10.0, rarity: "RARE" },
  { id: "SW-ENG", "name": "Hermes Engine Thruster", type: "HARDWARE", cost: 800000, power: 18.2, rarity: "RARE" }
];

function applyPermanentCritBonus(bonus) {
    // Verifica se o item já foi obtido para evitar duplicação de bônus e status
    if (!playerInventory.find(i => i.id === 'RD-KATANA' && i.rarity === 'ULTIMATE')) {
        window.playerCritChance += bonus;
        playerInventory.push({ id: 'RD-KATANA', name: "Red Dragon Katana", type: "ULTIMATE", rarity: "ULTIMATE", power: 30 });
        window.playerPowerBoost += 30; // Bônus massivo de poder
        addSecurityLog("PERMANENT_UPGRADE: Critical probability synchronized.", "log-warn");
        updateNeuralLink();
    }
}

function updateNeuralLink() {
  const lv = parseInt(document.getElementById('sao-lv-val').innerText) || 1;
  const winChance = document.getElementById('win-chance');
  const totalPower = lv + (window.playerPowerBoost || 0);
  const crit = window.playerCritChance || 5;
  if (winChance) {
    const chance = Math.min(99.5, (totalPower / 74) * 100).toFixed(1);
    winChance.innerHTML = `<i class="fas fa-bolt"></i> PWR: ${totalPower.toFixed(1)} | CRT: ${crit}% | WIN: ${chance}%`;
  }
}
function updateXP() {
  const total = Object.keys(quests).length;
  const completed = Object.values(quests).filter(q => q.completed).length;
  const pct = (completed / total) * 100;
  const fill = document.getElementById('sao-xp-fill');
  const lv = document.getElementById('sao-lv-val');
  
  // Calcula a experiência total acumulada
  const currentTotalXP = Object.values(quests)
    .filter(q => q.completed)
    .reduce((sum, q) => sum + (q.xp || 100), 0);
    
  const newLevel = Math.floor(currentTotalXP / 250) + 1;

  // Lógica de Level Up: Dispara quando o nível calculado é maior que o anterior
  if (newLevel > lastLevel) {
    const levelDiff = newLevel - lastLevel;
    window.playerMaxHP += levelDiff * 25; // Ganho de 25 HP por nível
    lastLevel = newLevel;
    
    playLevelUpSound();
    saoAnnouncement(`LEVEL UP: ${newLevel}`);
    saoNotify(`MAX HP INCREASED: ${window.playerMaxHP}`, "var(--teal)");
    
    // Cura completa automática ao subir de nível
    const hpFill = document.getElementById('sao-hp-fill');
    if (hpFill) hpFill.style.width = '100%';
  }

  if (fill) fill.style.width = pct + '%';
  if (lv) lv.innerText = newLevel;

  // Atualiza exibição de Woolongs no HUD
  const woolongsEl = document.getElementById('hud-woolongs');
  if (woolongsEl) woolongsEl.innerText = playerWoolongs.toLocaleString();

  updateHPHUD();
  
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

/**
 * Atualiza o rótulo textual de HP no HUD principal para refletir o progresso.
 */
function updateHPHUD() {
    const hpLabel = document.getElementById('hp-text-label');
    if (hpLabel) hpLabel.innerText = `HP: ${window.playerMaxHP} / ${window.playerMaxHP}`;
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
      <div class="item-price">${item.cost.toLocaleString()} ₩ | PWR +${item.power}</div>
      <button class="item-buy-btn" onclick="buyMarketItem('${item.id}')">BUY</button>
    </div>
  `).join('');
}

// Atalhos de Teclado para Combate
document.addEventListener('keydown', e => {
    if (!currentCombatState) return;
    const btnMap = { '1': 'ATTACK', '2': 'DEFEND', '3': 'SKILL', '4': 'EXECUTION' };
    const action = btnMap[e.key];
    if (action) {
        if (action === 'EXECUTION' && document.getElementById('exec-btn').style.display === 'none') return;
        processCombatTurn(action);
    }
});

/**
 * Novo motor de combate interativo.
 */
async function initiateBossDuel(bossId) {
    if (playerSP < 30) {
        saoNotify("EXAUSTÃO NEURAL: SP abaixo de 30%. Descanse.", "var(--red)");
        return;
    }

    const lv = parseInt(document.getElementById('sao-lv-val').innerText) || 1;
    const totalPower = lv + (window.playerPowerBoost || 0);
    
    let targetLevel = bossId === '90' ? 90 : (bossId === 'vicious' ? 120 : 74);
    let bossName = bossId === '90' ? "FATAL SCYTHE" : (bossId === 'vicious' ? "VICIOUS" : "GLEAM EYES");
    let reward = bossId === '90' ? 150000000 : (bossId === 'vicious' ? 300000000 : 50000000);

    playerSP -= 30;
    currentCombatState = {
        round: 1,
        bossHp: 10,
        playerSync: 100,
        baseChance: Math.min(99.5, (totalPower / targetLevel) * 100),
        reward: reward,
        bossId: bossId,
        bossName: bossName
    };

    const sprite = document.getElementById('boss-sprite');
    sprite.className = 'boss-pixel-art idle boss-' + bossId;
    
    document.getElementById('combat-boss-name').innerText = bossName;
    document.getElementById('combat-interface').style.display = 'flex';
    document.body.classList.add('boss-active');
    updateCombatUI(10); // Inicializa com HP cheio (10 unidades)
    saoAnnouncement("LINK START: CONFLITO NEURAL INICIADO");
}

function updateCombatUI(hpDelta = 0) {
    const log = document.getElementById('combat-log');
    log.innerText = `RODADA ${currentCombatState.round}/3: Selecione sua tática de ataque.`;
    
    const hpPct = (currentCombatState.bossHp / 10) * 100;
    const bar = document.getElementById('boss-hp-bar-inner');
    const text = document.getElementById('c-boss-hp-text');
    const syncText = document.getElementById('c-sync-val');
    const comboText = document.getElementById('c-combo-val');
    const execBtn = document.getElementById('exec-btn');
    
    if (bar) {
        bar.style.width = hpPct + '%';
        // Muda a cor baseado na saúde
        if (hpPct < 30) bar.style.background = 'var(--red)';
        else if (hpPct < 60) bar.style.background = 'var(--gold)';
        else bar.style.background = 'var(--teal)';
    }
    if (text) text.innerText = Math.max(0, Math.floor(hpPct));
    if (syncText) syncText.innerText = Math.floor(currentCombatState.playerSync);
    if (comboText) comboText.innerText = currentCombatState.combo;

    if (execBtn) {
        if (currentCombatState.combo >= 3 && currentCombatState.playerSync >= 100) {
            execBtn.style.display = 'block';
        } else {
            execBtn.style.display = 'none';
        }
    }
}

function processCombatTurn(action) {
    if (!currentCombatState) return;
    
    const sprite = document.getElementById('boss-sprite');
    sprite.classList.remove('idle');
    sprite.classList.add('hit');
    setTimeout(() => {
        if (currentCombatState) sprite.classList.add('idle');
        sprite.classList.remove('hit');
    }, 200);

    playClick();

    const roll = Math.random() * 100;
    let damage = 0;
    let comboGained = false;

    if (action === 'ATTACK') {
        damage = roll > 30 ? 4 : 1;
        createFloatingText(`-${damage} HP`, "var(--teal)");
        if (damage >= 4) comboGained = true;
        currentCombatState.playerSync -= 8;
    } else if (action === 'DEFEND') {
        damage = 2;
        createFloatingText("+DEF", "var(--cyan)");
        currentCombatState.playerSync += 15;
        currentCombatState.combo = 0; // Reset por postura defensiva
    } else if (action === 'SKILL') {
        damage = roll > 60 ? 7 : 0;
        if (damage > 0) createFloatingText("SKILL HIT!", "var(--gold)");
        if (damage >= 7) comboGained = true;
        currentCombatState.playerSync -= 20;
    } else if (action === 'EXECUTION') {
        damage = 100; // Overkill garantido
        currentCombatState.playerSync = 0;
        currentCombatState.combo = 0;
        saoAnnouncement("RELEASE RECOLLECTION!");
        document.body.classList.add('shake-intense');
        setTimeout(() => document.body.classList.remove('shake-intense'), 800);
        createFloatingText("OVERKILL", "var(--red)");

        // Aciona o efeito de flash branco na tela inteira
        const flash = document.createElement('div');
        flash.className = 'execution-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 1000);
    }

    if (comboGained) {
        currentCombatState.combo++;
        const syncBonus = currentCombatState.combo * 10;
        currentCombatState.playerSync += syncBonus;
        saoNotify(`COMBO x${currentCombatState.combo}! Sync +${syncBonus}%`, "var(--teal)");
    } else if (action !== 'DEFEND') {
        currentCombatState.combo = 0; // Miss ou ataque fraco quebra o combo
    }

    // Garante limites para o Sync Rate (0% - 150%)
    currentCombatState.playerSync = Math.max(0, Math.min(150, currentCombatState.playerSync));
    currentCombatState.bossHp -= damage;
    currentCombatState.round++;

    if (currentCombatState.round > 3 || currentCombatState.bossHp <= 0) {
        finishCombat();
    } else {
        updateCombatUI();
    }
}

async function finishCombat() {
    // O Sync Rate agora atua como um multiplicador direto na chance de vitória.
    // Se você estiver com 150% de Sync, sua chance base aumenta em 1.5x.
    playerSyncRate = currentCombatState.playerSync; // Sincroniza o estado global
    const syncMultiplier = playerSyncRate / 100;
    const finalChance = currentCombatState.baseChance * syncMultiplier;
    const win = currentCombatState.bossHp <= 0 || (Math.random() * 100 < finalChance);
    
    if (win) {
        const sprite = document.getElementById('boss-sprite');
        sprite.classList.remove('idle');
        sprite.classList.add('death');
        
        await new Promise(r => setTimeout(r, 800)); // Espera a animação de morte

        const reward = currentCombatState.reward;
        playerWoolongs += reward;
        
        // Simula o cálculo de loot do backend para o frontend
        const roll = Math.random() * 100;
        let rarity = roll > 90 ? "LEGENDARY" : roll > 70 ? "RARE" : "COMMON";
        let lootName = rarity === "LEGENDARY" ? "Dark Repulser Core" : rarity === "RARE" ? "Woolong Bundle" : "Scrap Metal";
        const summary = `Loot: ${rarity}: [${lootName}]`;

        saoNotify(`VITÓRIA! ${currentCombatState.bossName} neutralizado. +${reward.toLocaleString()} ₩`, "var(--gold)");
        
        // Atualiza o estado visual do card no mural de recompensas
        const questKey = currentCombatState.bossId === '74' ? 'boss_74' : 'boss_' + currentCombatState.bossId;
        completeQuest(questKey);

        // Parse the loot string from the backend summary
        const lootMatch = summary.match(/Loot: (COMMON|RARE|LEGENDARY|MYTHIC|ULTIMATE): \[(.*?)\]/);
        if (lootMatch) {
            const rarity = lootMatch[1];
            const itemName = lootMatch[2];
            playerInventory.push({ id: "LOOT-" + Date.now(), name: itemName, type: "LOOT", rarity: rarity, power: 0 });
            saoNotify(`NOVO LOOT: ${itemName} (${rarity})`, rarityColors[rarity]);
        }
        
        // Desgaste neural pós-combate (Fomenta o uso do comando 'rest' ou 'meditate')
        playerSyncRate = Math.max(0, playerSyncRate - 20);
        if (playerSyncRate < 30) document.body.classList.add('neural-fatigue-active');

        const rewardEl = document.getElementById('boss-reward-' + currentCombatState.bossId);
        if (rewardEl) {
            rewardEl.innerText = "STATUS: CLEARED";
            rewardEl.style.color = "var(--teal)";
        }

        completeQuest(currentCombatState.bossId === '74' ? 'boss_74' : 'boss_' + currentCombatState.bossId);
        if (currentCombatState.bossId === 'vicious') applyPermanentCritBonus(10); // This will add the Red Dragon Katana
    } else {
        triggerWarning();
        
        // Aciona o efeito de flash vermelho (Low HP)
        const flash = document.createElement('div');
        flash.className = 'low-hp-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 1200);

        saoNotify("DERROTA: Desconexão forçada pelo Cardinal.", "var(--red)");
    }
    document.getElementById('combat-interface').style.display = 'none';
    document.body.classList.remove('boss-active');
    currentCombatState = null;
    updateXP();
}

function buyMarketItem(itemId) {
  const item = marketCatalog.find(i => i.id === itemId);
  if (!item) return;

  if (playerWoolongs < item.cost) {
    saoNotify("SALDO INSUFICIENTE EM WOOLONGS", "var(--red)");
    return;
  }

  saoAnnouncement(`PURCHASING: ${item.name}...`);
  
  setTimeout(() => {
    saoNotify(`ITEM ACQUIRED: ${item.name}`, "var(--teal)");
    playerInventory.push({ ...item, rarity: item.rarity || "RARE" }); // Ensure rarity is added
    playerWoolongs -= item.cost;
    window.playerPowerBoost = (window.playerPowerBoost || 0) + item.power;
    updateNeuralLink();
    addSecurityLog(`Market: Item ${item.id} registered to player.`, "log-warn");
    renderHUDInventory();
    renderInventory();
  }, 1500);
}

function toggleInventory() {
  const modal = document.getElementById('inventory-modal');
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) renderInventory();
}

/**
 * Renderiza ícones compactos no HUD lateral para representar o inventário atual.
 */
function renderHUDInventory() {
    const hudInv = document.getElementById('hud-inventory-icons');
    if (!hudInv) return;
    
    hudInv.innerHTML = playerInventory.map(item => {
        let icon = item.type === 'HARDWARE' ? 'fa-microchip' : 
                   item.type === 'COMBAT' ? 'fa-sword' : 'fa-shield-halved';
        return `<i class="fas ${icon}" title="${item.name} (${item.rarity})" style="color:${rarityColors[item.rarity] || 'var(--teal)'}; font-size: 0.7rem; margin-right: 5px;"></i>`;
    }).join('');
}

function renderInventory() {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;
  if (playerInventory.length === 0) {
    grid.innerHTML = "<div style='grid-column: span 3; opacity:0.5'>Inventário Vazio. Visite o Black Market ou derrote Bosses.</div>";
    return;
  }
  grid.innerHTML = playerInventory.map(item => `
    <div class="item-card" style="border-color:${rarityColors[item.rarity] || 'var(--muted)'}">
      <div class="item-name" style="color:${rarityColors[item.rarity] || 'var(--cream)'}">${item.name}</div>
      <div class="item-price">POWER: +${item.power}</div>
      <div class="item-rarity" style="color:${rarityColors[item.rarity] || 'var(--muted)'}">${item.rarity}</div>
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

/**
 * Fecha o menu mobile de forma segura, resetando ícones e classes.
 */
function closeMobileMenu() {
  if (navContainer && navContainer.classList.contains('active')) {
    navContainer.classList.remove('active');
    const icon = menuToggle?.querySelector('i');
    if (icon) {
      icon.classList.add('fa-terminal');
      icon.classList.remove('fa-code-branch');
    }
  }
}

// Toggle do Menu Mobile
menuToggle?.addEventListener('click', () => {
  const isActive = navContainer.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-terminal', !isActive);
    icon.classList.toggle('fa-code-branch', isActive);
  }
});

// Fecha o menu ao clicar em um link
navAs.forEach(link => link.addEventListener('click', closeMobileMenu));

// Fecha o menu ao clicar fora da área de navegação
document.addEventListener('click', (e) => {
  if (navContainer.classList.contains('active') && !navContainer.contains(e.target)) {
    closeMobileMenu();
  }
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

// Throttle simples para o scroll
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => { updateNav(); scrollTicking = false; });
    scrollTicking = true;
  }
});
window.addEventListener('load', updateNav);

// ─── KONAMI CODE EASTER EGG ───
const KK=[38,38,40,40,37,39,37,39,66,65];
let kki=0;
document.addEventListener('keydown',e=>{
  if(e.keyCode===KK[kki]) kki++; else kki=0;
  if(kki===KK.length){kki=0; completeQuest('konami_master'); openEgg()}
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
  if(document.getElementById('hangar-modal').classList.contains('active')) completeQuest('hangar_engineer');
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

// Som de limpeza de dados (Digital Wipe)
const playClearSound = () => {
  if (!audioCtx) setupAudioNodes();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
  g.gain.setValueAtTime(0.1, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(); osc.stop(now + 0.4);
};

// Engine de Som de Estática (Old TV Static)
const playStaticSound = () => {
  if (!audioCtx) setupAudioNodes();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.2); // Fade in rápido

  whiteNoise.connect(g);
  g.connect(audioCtx.destination);
  whiteNoise.start();
  
  return { source: whiteNoise, gain: g };
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
  
  completeQuest('audio_sync');

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
  termInput.closest('.terminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Garante que ao ganhar foco (via Tab ou clique), o terminal seja centralizado
termInput?.addEventListener('focus', () => {
  termInput.closest('.terminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

/**
 * Executa a lógica de download de arquivos com barra de progresso.
 */
function executeDownloadLogic(fileName) {
  appendLine(`Iniciando transferência de '${fileName}'...`, "var(--gold)");
  const progId = 'prog-' + Date.now();
  appendLine(`<div class="t-progress-wrap"><div id="${progId}" class="t-progress-fill"></div></div> <span id="${progId}-val">0%</span>`, "var(--teal)", true);
  let p = 0;
  const int = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) {
      p = 100;
      clearInterval(int);
      appendLine("Download concluído. Integridade verificada.", "var(--teal)");
      completeQuest('hero'); // Exemplo de trigger de quest
    }
    document.getElementById(progId).style.width = p + '%';
    document.getElementById(progId + '-val').innerText = Math.floor(p) + '%';
  }, 150);
}

/**
 * Efeito de descriptografia de texto para o terminal.
 */
const decryptEffect = (targetText, color = 'var(--cream)') => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
  let iteration = 0;
  const line = document.createElement('div');
  line.className = 't-line';
  line.innerHTML = `<span class="t-cmd">></span> <span style="color:${color}"></span>`;
  termHistory.appendChild(line);
  const span = line.querySelector('span:last-child');
  
  const interval = setInterval(() => { // Removed `const` from `interval` to avoid redeclaration
    span.innerText = targetText.split("").map((char, index) => {
      if(index < iteration) return targetText[index];
      return chars[Math.floor(Math.random() * chars.length)]; // Removed `const` from `chars`
    }).join("");
    if(iteration >= targetText.length) clearInterval(interval);
    iteration += 1 / 3;
  }, 30);
};

// Engine de comandos otimizada
// Global data (not part of commands object)
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
  "curriculo.pdf": "[BINARY_DATA] Use o comando 'download cv' para descriptografar.",
  "manifesto.log": "A tecnologia não é o fim, mas o meio. Bebop-OS v1.0 é a interface entre o hardware e a alma.",
  "secret_floor.env": "DEBUG_DATA: Floor 100 access requires 'ULTIMATE' rarity gear. Good luck, Player One."
};

const commands = {
  // Informational commands (now functions)
  ls: () => appendLine("projetos/  certificados/  curriculo.pdf  intel_report.txt", "var(--cyan)"),
  about: () => appendLine("Pedro Augusto Floriano, 18 anos, Sorocaba/SP. Técnico em Eletrônica e Cibersegurança focado em proteção de sistemas e hardware.", "var(--cream)"),
  skills: () => appendLine("Cyber: Pentesting (Nmap, Burp), SOC, Networking (TCP/IP), Linux (Hardening). | Eletrônica: MCU, PCB Design, Automação.", "var(--cream)"),
  contact: () => appendLine("Email: florianop2008@gmail.com | LinkedIn: pedro-augusto-floriano\nStatus: Disponível para contratação.", "var(--cream)"),
  social: () => appendLine("Ações: Arrecadação ETEC, Apoio RS (Enchentes), Doador de Sangue frequente.", "var(--cream)"),
  badges: () => appendLine("Certificações: Ethical Hacker, Network Technician, Cyber Threat Management, Network Support.", "var(--cream)"),
  neofetch: () => appendLine(neofetchData, 'var(--gold)', true),

  // Action commands
  clear: () => { 
    termHistory.innerHTML = ''; 
    playClearSound();
    termInput.closest('.terminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  weather: () => {
    const conditions = ["Stormy (High Latency)", "Clear Skies", "Acid Rain", "Neural Fog"];
    const temp = (Math.random() * 45).toFixed(1);
    appendLine(`LOCAL_ATMOSPHERE: ${conditions[Math.floor(Math.random() * conditions.length)]} | TEMP: ${temp}°C`, "var(--cyan)");
  },
  history: () => {
    cmdHistory.forEach((cmd, i) => appendLine(`${i + 1}  ${cmd}`, "var(--muted)"));
  },
  shop: (args) => { // Consolidated shop command
    if (!args[0]) {
      appendLine("--- BLACK_MARKET_CATALOG ---", "var(--gold)");
      marketCatalog.forEach(item => {
        appendLine(`${item.id}: ${item.name} | PWR +${item.power} | ${item.cost.toLocaleString()} ₩`, "var(--cream)");
      });
      appendLine("Use 'shop [ID]' para adquirir equipamento.", "var(--muted)");
    } else {
      const itemId = args[0].toUpperCase();
      buyMarketItem(itemId);
    }
  },
  daily: () => {
    const bonus = 2500;
    playerWoolongs += bonus;
    updateXP();
    appendLine(`DAILY_REWARD: +${bonus.toLocaleString()} ₩ creditados via Bebop-Bank.`, "var(--gold)");
    addSecurityLog("Financial Transaction: Daily stipend received.", "log-warn");
  },
  meditate: () => {
    playerSP = Math.min(100, playerSP + 20);
    appendLine("Iniciando calibração de ondas cerebrais...", "var(--gold)");
    setTimeout(() => appendLine("CARDINAL: Protocolo de meditação concluído. SP +20.", "var(--teal)"), 1000);
  },
  rest: () => {
    playerSP = 100;
    appendLine("Sincronização neural restaurada. Stamina: 100%", "var(--teal)");
    updateHPHUD();
  },
  "download": (args) => {
    if (args[0] === 'cv') {
       executeDownloadLogic("curriculo_paf.pdf");
    } else appendLine("Uso: download cv", "var(--muted)");
  },
  "scan-network": (args) => {
    const targetIP = args[0];
    if (!targetIP) {
        appendLine("--- LOCAL_NETWORK_NODES ---", "var(--gold)");
        networkDevices.forEach(d => {
            appendLine(`IP: ${d.ip} | ID: ${d.name} | [${d.status}]`, "var(--cream)");
        });
        appendLine("Use 'scan-network [IP]' para tentar interagir.", "var(--muted)");
        return;
    }

    const device = networkDevices.find(d => d.ip === targetIP);
    if (!device) return appendLine(`Erro: IP ${targetIP} não encontrado na sub-rede atual.`, "var(--red)");

    appendLine(`Interagindo com ${device.name}...`, "var(--gold)");
    setTimeout(() => {
        if (device.status === "VULNERABLE" || device.status === "SUSPICIOUS") {
            if (device.reward > 0) {
                playerWoolongs += device.reward;
                appendLine(`SUCCESS: Bypass concluído. Extraído: ${device.reward} ₩`, "var(--teal)");
                device.reward = 0; // Evita farm infinito
                device.status = "CLEANED";
                updateXP();
            } else {
                appendLine("INFO: Nenhum dado valioso restante neste nó.", "var(--muted)");
            }
        } else {
            appendLine(`ACCESS_DENIED: Nó ${device.status}. Criptografia Cardinal impenetrável.`, "var(--red)");
        }
    }, 1500);
  },
  transfer: (args) => {
    const amount = parseInt(args[0]);
    const target = args[1] || "UNKNOWN_NODE";
    if (isNaN(amount) || amount <= 0) return appendLine("Erro: Especifique um valor válido (Ex: transfer 500 BEBOP)", "var(--red)");
    if (playerWoolongs < amount) return appendLine("Erro: Saldo insuficiente para transferência.", "var(--red)");

    playerWoolongs -= amount;
    updateXP();
    appendLine(`Transferindo ${amount} ₩ para ${target.toUpperCase()}...`, "var(--gold)");
    setTimeout(() => appendLine("Transação encriptada via Cardinal Protocol concluída.", "var(--teal)"), 1000);
  },
  "system-call": (args) => {
    const sub = args[0];
    if (sub === 'overload') {
        document.body.classList.add('destruct-active');
        setTimeout(() => document.body.classList.remove('destruct-active'), 2000);
        appendLine("CARDINAL: Forçando sobrecarga de buffers neurais...", "var(--red)");
    } else if (sub === 'purge') {
        if (document.body.classList.contains('emergency-mode')) {
            appendLine("Iniciando purga de sistema...", "var(--teal)");
            setTimeout(resolveEmergency, 1000);
        } else {
            appendLine("Sistema já se encontra em estado nominal.", "var(--muted)");
        }
    } else {
        appendLine("Uso: system-call [overload|purge]", "var(--gold)");
    }
  },
  scan: () => {
    const scanLine = document.getElementById('scan-line');
    if(scanLine) scanLine.classList.add('scanning');
    appendLine("Iniciando Deep Scan nas camadas de rede local...", "var(--teal)");
    setTimeout(() => {
        if(scanLine) scanLine.classList.remove('scanning');
        appendLine("Varredura concluída. Integridade do Kernel: 100%.", "var(--teal)");
        addSecurityLog("System Integrity Check: PASSED", "log-warn");
    }, 2000);
  },
  help: () => {
    const execs = Object.keys(commands).filter(k => typeof commands[k] === 'function').join(', ');
    appendLine("COMANDOS DISPONÍVEIS: " + execs, "var(--gold)");
    appendLine("DICA: Use 'shop' para ver o catálogo ou 'status' para sua progressão.", "var(--muted)");
  },
  status: () => {
      appendLine("FETCHING DATA FROM CARDINAL SYSTEM...", "var(--gold)");
      setTimeout(() => {
        appendLine("--- NEURAL_LINK_PROFILE ---", "var(--gold)");
        appendLine(`LVL: ${lastLevel} | SYNC: ${playerSyncRate}%`, "var(--teal)");
        appendLine(`WOOLONGS: ${playerWoolongs.toLocaleString()} ₩`, "var(--gold)");
        appendLine(`POWER_BOOST: +${window.playerPowerBoost}`, "var(--cyan)");
        appendLine("--------------------------", "var(--muted)");
      }, 500);
  },
  cat: (args) => {
    const fileName = args[0]; // Correctly get filename from args
    if (virtualFiles[fileName]) {
        decryptEffect(virtualFiles[fileName]);
        completeQuest('archivist');
    } else {
        appendLine(`Erro: Arquivo '${fileName}' não encontrado.`, "var(--red)");
    }
  },
  missions: () => { // Renamed from status to missions for clarity
        appendLine("--- CARDINAL_ACTIVE_MISSIONS ---", "var(--gold)");
        const qEntries = Object.values(quests);
        const total = qEntries.length;
        const completed = qEntries.filter(q => q.completed).length;
        
        qEntries.forEach(q => {
          const mark = q.completed ? "[OK]" : "[..]";
          appendLine(`${mark} ${q.title}`, q.completed ? "var(--teal)" : "var(--muted)");
        });
  },
  stacia: () => {
    document.body.classList.toggle('stacia-mode');
    const isStacia = document.body.classList.contains('stacia-mode');
    appendLine(isStacia ? "Privilégios Administrativos 'STACIA' concedidos." : "Privilégios revogados.", "var(--gold)");
    if(isStacia) {
        completeQuest('stacia_mode');
        playLevelUpSound();
    }
  },
  // Other commands that were previously just strings or had simple logic
  ssh: () => {
    appendLine("Estabelecendo túnel SSH encriptado...", "var(--gold)");
    setTimeout(() => {
      termHistory.innerHTML = '';
      appendLine("CONECTADO: root@bebop_vessel", "var(--teal)");
      appendLine("Sistemas de propulsão: NOMINAL", "var(--cream)");
      appendLine("Localização atual: Órbita de Marte", "var(--cream)");
      appendLine("Digite 'exit' para retornar ao shell local.", "var(--muted)");
    }, 1500);
  },
  db: (args) => {
    const col = args[0];
    if (!col) return appendLine("Uso: db [collection]", "var(--gold)");
    mockDB.connect().then(() => mockDB.find(col)).then(res => {
      appendLine(JSON.stringify(res, null, 2), "var(--cream)");
    });
  },
  whois: () => {
    appendLine("Rastreando origem da conexão...", "var(--gold)");
    fetchIntelligence().then(data => {
      if(data) {
        appendLine(`IP: ${data.ip} | Org: ${data.org} | Loc: ${data.city}/${data.region}`, "var(--teal)");
      } else {
        appendLine("Falha ao obter dados de inteligência.", "var(--red)");
      }
    });
  },
  hack: () => {
    document.body.classList.toggle('hacking-mode');
    const isHacking = document.body.classList.contains('hacking-mode');
    appendLine("SISTEMA_OVERRIDE: MODO " + (isHacking ? "ATIVADO" : "DESATIVADO"), "var(--red)");
    toggleHackerAudio(document.body.classList.contains('hacking-mode'));
  },
  matrix: () => {
    document.body.classList.toggle('hacking-mode'); // Matrix mode can also be a hacking mode
    const isHacking = document.body.classList.contains('hacking-mode');
    mCanvas.style.display = isHacking ? 'block' : 'none';
    if(isHacking) {
      initMatrix();
      matrixInterval = setInterval(drawMatrix, 33);
    } else {
      clearInterval(matrixInterval);
    }
    appendLine("DIGITAL_RAIN: " + (isHacking ? "ATIVADO" : "DESATIVADO"), "var(--cyan)");
  },
  exit: () => {
    termHistory.innerHTML = '';
    appendLine("Conexão encerrada. Retornando ao host local...", "var(--gold)");
  },
  "sudo self-destruct": () => appendLine("PROTOCOL_INITIATED: System self-destruct sequence engaged. This action cannot be undone.", "var(--red)"),
  "link-start": () => saoAnnouncement("LINK START: INICIANDO MERGULHO NEURAL"),
  audit: () => {
    appendLine("Requisitando SecurityAuditService via API...", "var(--gold)");
    setTimeout(() => {
        decryptEffect("[REPORT-2025] STATUS: STABLE | COMPLIANCE: 100%", "var(--teal)");
        addSecurityLog("Audit report generated by PAF-OS", "log-warn");
    }, 1200);
  },
  inventory: () => {
    appendLine("--- NEURAL_STORAGE_INVENTORY ---", "var(--teal)");
    if (playerInventory.length === 0) return appendLine("STORAGE_EMPTY: No items found.", "var(--muted)");
    playerInventory.forEach(item => {
        appendLine(`ID: ${item.id} | NAME: ${item.name}`, "var(--cream)");
        appendLine(`  > TYPE: ${item.type} | STAT_BUFF: +${item.power} PWR`, "var(--muted)");
    });
  },
  shutdown: () => {
    appendLine("INICIANDO SEQUÊNCIA DE DESLIGAMENTO...", "var(--red)");
    addSecurityLog("KERNEL_HALT: System shutdown initiated.", "log-crit");
    
    // Inicia som de estática (TV Antiga)
    const tvStatic = playStaticSound();
    
    // Fade out do áudio se estiver tocando
    if (typeof fadeVolume === 'function' && !lofiAudio.paused) {
        fadeVolume(0, 2500);
    }

    setTimeout(() => {
        saoAnnouncement("SYSTEM_OFFLINE");
        document.body.classList.add('shutdown-active');
        appendLine("Conexão perdida com o Cardinal System.", "var(--muted)");
        
        // Desliga a estática gradualmente após o fade visual
        if (tvStatic) {
            tvStatic.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3);
            setTimeout(() => tvStatic.source.stop(), 3100);
        }
    }, 1200);
  },
  reboot: () => {
    document.body.dataset.rebooting = "true";
    commands.shutdown();
    appendLine("REBOOT_SEQUENCE: Reinicializando kernel em 5s...", "var(--gold)");
    setTimeout(() => {
        location.reload();
    }, 5000);
  },
  credits: () => {
    termHistory.innerHTML = ''; // Limpa o terminal antes de iniciar os créditos
    playClearSound();
    const creditsData = [
      "",
      "--- BEBOP-OS SYSTEM CREDITS ---",
      "VERSION: 1.0.0-STABLE",
      "NODE: BEBOP-CENTRAL-V1",
      "",
      "DIRECTOR: PEDRO AUGUSTO FLORIANO",
      "LEAD DEVELOPER: PEDRO AUGUSTO FLORIANO",
      "SYSTEM ARCHITECT: CARDINAL AI ENGINE",
      "NEURAL INTERFACE: SAO-LINK PROTOCOL",
      "SOUNDSCAPE: COWBOY LO-FI SESSIONS",
      "",
      "ASSETS & INSPIRATIONS:",
      "- SUNRISE STUDIO (COWBOY BEBOP)",
      "- REKI KAWAHARA (SWORD ART ONLINE)",
      "- CYBERPUNK AESTHETICS (GENRE)",
      "- OPEN SOURCE COMMUNITY (TOOLS)",
      "",
      "TECHNOLOGIES USED:",
      "- HTML5 / CSS3 / JAVASCRIPT",
      "- JAVA 17 / SPRING BOOT",
      "- MAVEN / GITHUB ACTIONS",
      "",
      "SPECIAL THANKS:",
      "ETEC RUBENS DE FARIA E SOUZA",
      "FAMILY, FRIENDS AND MENTORS",
      "AND YOU, SPACE COWBOY.",
      "",
      "-------------------------",
      "SEE YOU SPACE COWBOY...",
      "-------------------------",
      ""
    ];

    let lineIdx = 0;
    appendLine("INICIANDO SEQUÊNCIA DE CRÉDITOS...", "var(--gold)");
    
    const scrollInterval = setInterval(() => {
      if (lineIdx < creditsData.length) {
        appendLine(creditsData[lineIdx], lineIdx % 2 === 0 ? "var(--gold)" : "var(--cream)");
        lineIdx++;
      } else {
        clearInterval(scrollInterval);
        addSecurityLog("Credits sequence completed.", "log-warn");
      }
    }, 500); // 500ms entre cada linha para um scroll suave
  }
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
    const fullInput = termInput.value.trim();
    const args = fullInput.split(' ');
    const cmd = args.shift().toLowerCase();
    
    if (cmd !== "") {
      cmdHistory.push(fullInput);
      localStorage.setItem('term_history', JSON.stringify(cmdHistory.slice(-20)));
      
      // Progressão de Missão: Ghost in the Shell (5 comandos únicos)
      const uniqueCmds = new Set(cmdHistory.map(h => h.split(' ')[0].toLowerCase()));
      if (uniqueCmds.size >= 5) completeQuest('terminal_pro');

      // Aciona completude de quest se o comando for um ID de quest (ex: ls, about)
      if (quests[cmd]) completeQuest(cmd);

      // Verifica se é um comando composto (ex: sudo self-destruct)
      const fullCmdKey = args.length > 0 ? `${cmd} ${args.join(' ')}` : cmd;
      const activeCmd = commands[fullCmdKey] || commands[cmd];

      if (activeCmd) {
          if (typeof activeCmd === 'function') {
              activeCmd(args); 
          } else {
              appendLine(activeCmd, "var(--cream)");
          }
      } else {
          appendLine(`Erro: Comando '${cmd}' não reconhecido.`, "var(--red)");
      }
    }
    termInput.value = ''; // Clear input after command
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