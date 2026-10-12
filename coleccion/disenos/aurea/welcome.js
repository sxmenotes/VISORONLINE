(() => {
  const welcome = document.getElementById('welcome');
  const content = document.getElementById('invitation-content');
  const button = document.getElementById('open-invitation');
  if (!welcome || !button) {
    content.hidden = false;
    requestAnimationFrame(() => document.dispatchEvent(new CustomEvent('invitation:opened', {detail:{deepLink:!!location.hash}})));
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let opening = false, opened = false, timeline, fallbackTimer;
  function reveal() {
    if (opened) return;
    opened = true;
    clearTimeout(fallbackTimer);
    welcome.hidden = true;
    content.hidden = false;
    if (!window.gsap) content.classList.add('invitation-revealed');
    const requestedSection = document.getElementById(location.hash.slice(1));
    const target = requestedSection && content.contains(requestedSection) ? requestedSection : document.querySelector('.hero h1');
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (requestedSection && content.contains(requestedSection)) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    document.dispatchEvent(new CustomEvent('invitation:opened', {detail:{deepLink:!!requestedSection}}));
  }
  button.addEventListener('click', () => {
    if (opening) return;
    opening = true;
    button.setAttribute('aria-disabled', 'true');
    document.getElementById('open-label').textContent = 'Abriendo nuestra historia…';
    document.getElementById('welcome-status').textContent = 'Abriendo la invitación.';
    if (reduceMotion.matches) { reveal(); return; }
    if (window.gsap) {
      welcome.classList.add('gsap-opening');
      timeline = gsap.timeline({defaults:{ease:'power2.inOut'},onComplete:reveal});
      timeline.to('.envelope-seal',{opacity:0,scale:1.18,duration:.24})
        .to('.envelope-flap',{rotationX:180,transformOrigin:'50% 0%',duration:.65},.15)
        .set('.envelope-flap',{zIndex:0},.48)
        .to('.envelope-letter',{yPercent:-47,duration:.65,ease:'power3.out'},.58)
        .to('.open-label,.open-hint',{opacity:0,duration:.25},.75)
        .to(welcome,{opacity:0,y:-12,duration:.38},1.2);
    } else {
      welcome.classList.add('is-opening');
      fallbackTimer = window.setTimeout(reveal,1550);
    }
  });
  button.disabled = false;
  reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches&&opening&&!opened){timeline?.kill();reveal();}});
})();
