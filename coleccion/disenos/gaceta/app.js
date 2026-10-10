(() => {
 const $=id=>document.getElementById(id),on=(id,type,fn)=>$(id)?.addEventListener(type,fn);
 const c=JSON.parse($('wedding-config').textContent),online=c.mode==='production'&&c.confirmation?.channel==='online';
 if($('days')&&Number.isFinite(Date.parse(c.date))){const update=()=>{const d=Math.max(0,Date.parse(c.date)-Date.now());[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60].forEach((v,i)=>{const e=$(['days','hours','minutes','seconds'][i]);if(e)e.textContent=String(v).padStart(2,'0');});};update();setInterval(update,1000);}
 const audio=$('background-music');if(audio)audio.volume=.3;
 function musicUI(){if(!audio)return;const active=!audio.paused;$('music-toggle').setAttribute('aria-pressed',String(active));$('music-label').textContent=active?'Silenciar música':'Activar música';}
 function pause(){audio?.pause();musicUI();}
 on('music-toggle','click',async()=>{try{if(audio.paused)await audio.play();else audio.pause();musicUI();}catch{$('music-status').textContent='No se pudo reproducir la música. Inténtalo nuevamente.';}});audio?.addEventListener('pause',musicUI);
 document.querySelectorAll('a[href*="open.spotify.com"]').forEach(e=>e.addEventListener('click',pause));
 on('load-spotify','click',()=>{pause();const panel=$('spotify-panel');if(!panel.querySelector('iframe')){const frame=document.createElement('iframe');frame.src=c.spotify.url.replace('/playlist/','/embed/playlist/').split('?')[0]+'?theme=0';frame.title=c.spotify.label;frame.width='100%';frame.height='420';frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';frame.style.border='0';panel.replaceChildren(frame);}$('load-spotify').textContent='Reproductor abierto';});
 async function copy(value,target){try{await navigator.clipboard.writeText(value);$(target).textContent='Copiado.';}catch{$(target).textContent='Puedes copiarlo manualmente: '+value;}}
 on('copy-alias','click',()=>copy(c.giftCopy,'copy-status'));on('copy-hashtag','click',()=>copy('#'+c.instagram.hashtag,'social-status'));
 const photo=$('photo-dialog');document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{$('large-photo').src=button.dataset.photo;$('large-photo').alt=button.querySelector('img').alt;$('photo-caption').textContent=button.dataset.caption;photo.showModal();}));document.querySelector('.close-photo')?.addEventListener('click',()=>photo.close());photo?.addEventListener('click',e=>{if(e.target===photo)photo.close();});
 let guestToken='',guest=null;
 const status=text=>{if($('form-status')){$('form-status').hidden=false;$('form-status').textContent=text;}};
 const storageKey='atelier-guest-'+c.slug;
 async function guestAPI(path,body){const response=await fetch('/api/'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+guestToken,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});const data=await response.json();if(!response.ok)throw Error(data.error||'No se pudo guardar. Inténtalo nuevamente.');return data;}
 async function loadGuest(raw){
  $('rsvp-fields').disabled=true;let value=raw.trim();if(value.includes('#invitado='))value=value.split('#invitado=')[1].split('&')[0];
  if(!/^[a-zA-Z0-9_-]{43}$/.test(value)){status('Pega el código o enlace personal que te enviaron.');return;}
  guestToken=value;
  try{const result=await guestAPI('guest');guest=result.guest;try{sessionStorage.setItem(storageKey,guestToken);}catch{}$('guest-info').textContent=`${guest.name} · Hasta ${guest.seats} ${guest.seats===1?'persona':'personas'}`;$('name').value=guest.name;$('attending').max=String(guest.seats);$('attending').value=String(guest.status==='pending'?1:guest.attending);$('members').value=guest.members.join('\n');$('diet').value=guest.dietary;$('note').value=guest.note;const choice=document.querySelector(`input[name="attendance"][value="${guest.status==='no'?'no':'yes'}"]`);choice.checked=true;$('rsvp-fields').disabled=result.closed;$('guest-code').value='';status(result.closed?'El plazo de confirmación ha finalizado.':guest.status==='pending'?'Tu invitación está lista. Completa tu respuesta.':'Esta es tu respuesta guardada. Puedes actualizarla.');}catch(e){guest=null;status(e.message);}
 }
 if(online){let initial='';if(location.hash.startsWith('#invitado=')){initial=location.hash.slice(10);history.replaceState(null,'',location.pathname+location.search);}else try{initial=sessionStorage.getItem(storageKey)||'';}catch{}if(initial)loadGuest(initial);on('load-guest','click',()=>loadGuest($('guest-code').value));}
 document.querySelectorAll('input[name="attendance"]').forEach(input=>input.addEventListener('change',()=>{if(online){const yes=document.querySelector('input[name="attendance"]:checked')?.value==='yes';$('attending').value=yes?'1':'0';$('members').disabled=!yes;}}));
 on('rsvp-form','submit',async e=>{
  e.preventDefault();const f=e.currentTarget,name=f.elements.name.value.trim();if(!name){f.elements.name.setCustomValidity('Escribe tu nombre.');f.elements.name.reportValidity();return;}
  const yes=f.elements.attendance.value==='yes',button=$('submit-rsvp');
  if(c.preview){status('Vista previa: las confirmaciones se habilitan al publicar.');return;}
  if(c.mode==='demo'){status(`Gracias, ${name}. Esta es una demostración: no se envió ni guardó tu respuesta.`);return;}
  if(online){
   if(!guest){status('Carga tu invitación personal antes de confirmar.');return;}
   const attending=yes?Number($('attending').value):0,members=yes?$('members').value.split('\n').map(s=>s.trim()).filter(Boolean):[];
   if(members.length!==attending){status('Escribe un nombre por cada persona que asistirá.');return;}
   button.disabled=true;
   try{const result=await guestAPI('rsvp',{status:yes?'yes':'no',attending,members,dietary:$('diet').value.trim(),note:$('note').value.trim(),version:guest.version,consent:$('consent').checked});guest=result.guest;status('Tu respuesta quedó guardada. ¡Gracias por avisarnos!');}catch(err){status(err.message);}finally{button.disabled=false;}
  }else{
   const message=`Hola, soy ${name}. ${yes?'Confirmo mi asistencia':'No podré asistir'} a la boda de ${c.names}. ${$('diet').value?'Restricciones alimentarias: '+$('diet').value+'. ':''}${$('note').value}`;
   const url=c.confirmation.channel==='whatsapp'?`https://wa.me/${c.confirmation.whatsapp}?text=${encodeURIComponent(message)}`:`mailto:${c.confirmation.email}?subject=${encodeURIComponent('Confirmación · '+c.names)}&body=${encodeURIComponent(message)}`;
   if(c.confirmation.channel==='whatsapp')window.open(url,'_blank','noopener,noreferrer');else location.href=url;status('Revisa y envía el mensaje en tu aplicación. Esta página no puede confirmar su envío.');
  }
 });on('name','input',e=>e.target.setCustomValidity(''));
})();
