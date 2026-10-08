(() => {
  if (!window.gsap) return;
  const gsap = window.gsap;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (!document.getElementById('welcome')) return;
    gsap.from('.welcome-eyebrow, #welcome-title, .welcome-intro, .welcome-signature', {
      y:16, opacity:0, duration:.85, stagger:.12, ease:'power2.out', clearProps:'transform,opacity'
    });
  });
  document.addEventListener('invitation:opened', event => {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const responsive = gsap.matchMedia();
    responsive.add({desktop:'(min-width: 741px)', mobile:'(max-width: 740px)', motion:'(prefers-reduced-motion: no-preference)'}, context => {
      if (!context.conditions.motion) return;
      const distance = context.conditions.desktop ? 32 : 18;
      if (!event.detail.deepLink && window.scrollY < 100) {
        gsap.from('.hero-copy > *', {y:20,opacity:0,duration:.75,stagger:.08,ease:'power2.out',clearProps:'transform,opacity'});
        gsap.from('.hero-art', {opacity:0,scale:.98,duration:1.1,ease:'power2.out',clearProps:'transform,opacity'});
      }
      if (!window.ScrollTrigger) return;
      document.querySelectorAll('.section').forEach(section => {
        const targets = [...section.children];
        if (!targets.length) return;
        gsap.from(targets, {
          y:distance,opacity:0,duration:.8,stagger:.1,ease:'power2.out',clearProps:'transform,opacity',
          scrollTrigger:{trigger:section,start:'top 90%',once:true}
        });
      });
      document.querySelectorAll('.venue-grid,.timeline,.gallery-grid,.gift-grid,.recommendation-grid').forEach(group => {
        if (!group.children.length) return;
        gsap.from(group.children, {
          y:context.conditions.desktop ? 24 : 12,opacity:0,duration:.65,stagger:.13,ease:'power2.out',clearProps:'transform,opacity',
          scrollTrigger:{trigger:group,start:'top 88%',once:true}
        });
      });
      ScrollTrigger.refresh();
    });
    document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
    document.querySelectorAll('#invitation-content img').forEach(img=>{
      if(!img.complete) img.addEventListener('load',()=>window.ScrollTrigger?.refresh(),{once:true});
    });
  }, {once:true});
})();
