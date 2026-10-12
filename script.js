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

// Decoración en bucle, sin controles ni interacción. Los navegadores pueden
// bloquear autoplay; reintentamos al volver a la página o al primer gesto.
const heroVideo=document.querySelector('.hero-video');
if(heroVideo){
 heroVideo.muted=true;
 heroVideo.defaultMuted=true;
 const playHero=()=>{if(!document.hidden&&heroVideo.paused)heroVideo.play().catch(()=>{});};
 playHero();
 window.addEventListener('pageshow',playHero);
 document.addEventListener('visibilitychange',playHero);
 document.addEventListener('pointerdown',playHero,{once:true,passive:true});
 document.addEventListener('keydown',playHero,{once:true});
}

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
  for(const selector of ['.steps li','.plan'])gsap.from(selector,{scrollTrigger:{trigger:document.querySelector(selector).parentElement,start:'top 92%',once:true},y:25,opacity:0,duration:.7,stagger:.12,clearProps:'transform,opacity'});
 });
}
