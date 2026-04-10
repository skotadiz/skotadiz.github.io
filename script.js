// ─── CURSOR ───
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});

/**
 * Anima o anel do cursor usando uma interpolação suave (easing) baseada na posição atual do mouse.
 */
function animRing(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();

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
for(let i=0;i<120;i++) particles.push(new Particle());

/**
 * Loop principal de animação do canvas: limpa o quadro e redesenha todas as partículas.
 */
function animParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw()});
  requestAnimationFrame(animParticles);
}
animParticles();

// ─── LOADER ───
const lbar=document.getElementById('lbar');
const ltxt=document.getElementById('ltext');
const msgs=['Inicializando sistemas...','Carregando módulos...','Conectando à nave Bebop...','Sistemas online — pronto.'];
let prog=0,mi=0;
const loadInt=setInterval(()=>{
  prog+=Math.random()*4+1;
  if(prog>100) prog=100;
  lbar.style.width=prog+'%';
  ltxt.textContent=msgs[Math.floor(mi/25)%msgs.length]; mi++;
  if(prog>=100){
    clearInterval(loadInt);
    setTimeout(()=>{
      const l=document.getElementById('loader');
      l.style.transition='opacity .6s';
      l.style.opacity='0';
      setTimeout(()=>l.style.display='none',600);
    },400);
  }
},40);

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
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
  el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
}

// ─── NAV ACTIVE STATE ───
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let curr = "";
  secs.forEach(s => { if(window.scrollY >= s.offsetTop - 150) curr = s.id; });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${curr}` ? 'var(--gold)' : '';
  });
});

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

// ─── LOFI CONTROL ───
const lofiAudio = document.getElementById('background-lofi');
const lofiToggle = document.getElementById('lofi-toggle');
const lofiIcon = lofiToggle.querySelector('i');
lofiAudio.volume = 0.02;

lofiAudio.play().catch(() => {});

lofiToggle.addEventListener('click', () => {
  if (lofiAudio.volume === 0) {
    lofiAudio.volume = 0.02;
    lofiIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
  } else {
    lofiAudio.volume = 0;
    lofiIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
  }
});