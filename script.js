const header=document.querySelector('.header');
const menu=document.querySelector('.menu-button');
const navigation=document.querySelector('#navigation');
menu.hidden=false;header.classList.add('enhanced');
function setMenu(open){menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);menu.querySelector('span').textContent=open?'−':'＋';}
document.addEventListener('click',event=>{if(!header.contains(event.target)&&menu.getAttribute('aria-expanded')==='true')setMenu(false);});
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
navigation.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});
const mobile=matchMedia('(max-width:700px)');mobile.addEventListener('change',()=>setMenu(false));

// The preview remains a swipeable, keyboard-scrollable row without JavaScript.
const track=document.querySelector('.preview-track');
const cards=[...track.querySelectorAll('.design')];
const controls=document.querySelector('.preview-controls');
const previous=document.querySelector('#previous-design');
const next=document.querySelector('#next-design');
const position=document.querySelector('#preview-position');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let active=0,frame=0,slideTween;
controls.hidden=false;
function updatePosition(){
 const bounds=track.getBoundingClientRect();const center=bounds.left+bounds.width/2;
 active=cards.reduce((best,card,i)=>{const r=card.getBoundingClientRect();const b=cards[best].getBoundingClientRect();return Math.abs(r.left+r.width/2-center)<Math.abs(b.left+b.width/2-center)?i:best;},0);
 // Edges may show multiple cards; preserve access to both ends.
 if(track.scrollLeft<2)active=0;
 if(track.scrollWidth>track.clientWidth&&track.scrollLeft>=track.scrollWidth-track.clientWidth-2)active=cards.length-1;
 position.textContent=`${String(active+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')} · ${cards[active].querySelector('h3').textContent}`;
 previous.disabled=active===0;next.disabled=active===cards.length-1;
}
function move(direction){
 const target=cards[Math.max(0,Math.min(cards.length-1,active+direction))];
 const left=Math.max(0,Math.min(track.scrollWidth-track.clientWidth,track.scrollLeft+target.getBoundingClientRect().left-track.getBoundingClientRect().left-(track.clientWidth-target.offsetWidth)/2));
 slideTween?.kill();
 if(window.gsap&&!reduced.matches){track.classList.add('is-moving');slideTween=gsap.to(track,{scrollLeft:left,duration:.65,ease:'power2.inOut',onComplete(){track.classList.remove('is-moving');updatePosition();},onInterrupt(){track.classList.remove('is-moving');}});}
 else{track.scrollLeft=left;updatePosition();}
}
previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(updatePosition);},{passive:true});
track.addEventListener('keydown',event=>{if(event.target===track&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}});
for(const name of ['pointerdown','wheel'])track.addEventListener(name,()=>slideTween?.kill(),{passive:true});
window.addEventListener('resize',updatePosition);reduced.addEventListener('change',()=>{slideTween?.kill();track.classList.remove('is-moving');updatePosition();});
updatePosition();
// All content starts visible. If GSAP or ScrollTrigger cannot load, nothing is hidden.
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const motion=gsap.matchMedia();
 motion.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.hero-copy > *',{y:24,opacity:0,duration:.8,stagger:.1,ease:'power2.out',clearProps:'transform,opacity'});
  gsap.from('.hero-art',{y:25,opacity:0,duration:1.1,delay:.2,ease:'power2.out',clearProps:'transform,opacity'});
  for(const selector of ['.intro','.collection-heading','.experience-copy','.process .section-heading','.plans .section-heading','.faq > div:first-child','.contact-inner']){
   gsap.utils.toArray(selector).forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%',once:true},y:28,opacity:0,duration:.8,ease:'power2.out',clearProps:'transform,opacity'}));
  }
  gsap.from('.preview-track .design',{scrollTrigger:{trigger:track,start:'top 92%',once:true},y:30,opacity:0,duration:.7,stagger:.07,clearProps:'transform,opacity'});
  for(const selector of ['.steps li','.plan'])gsap.from(selector,{scrollTrigger:{trigger:document.querySelector(selector).parentElement,start:'top 92%',once:true},y:25,opacity:0,duration:.7,stagger:.12,clearProps:'transform,opacity'});
 });
}
