(() => {
 const form=document.querySelector('#contact-form');
 if(!form)return;
 const names=['nombre1','nombre2'];
 const plans={clasica:'Clásica · $40.000 CLP',platino:'Platino · $55.000 CLP',gold:'Gold · $70.000 CLP'};
 const designs={editorial:'Editorial',nocturno:'Nocturno',mediterraneo:'Mediterráneo',albor:'Albor',vanguardia:'Vanguardia',gaceta:'Gaceta',seda:'Seda',prisma:'Prisma'};
 const field=name=>form.elements.namedItem(name);
 function select(name,value,allowed){if(Object.hasOwn(allowed,value))field(name).value=value;}
 const params=new URLSearchParams(location.search);
 select('plan',params.get('plan'),plans);select('diseno',params.get('diseno'),designs);
 document.querySelectorAll('[data-contact-plan]').forEach(link=>link.addEventListener('click',()=>select('plan',link.dataset.contactPlan,plans)));
 for(const name of names)field(name).addEventListener('input',()=>field(name).setCustomValidity(''));
 form.querySelector('button[type="submit"]').disabled=false;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  for(const name of names)field(name).setCustomValidity(field(name).value.trim()?'':'Escriban un nombre.');
  if(!form.reportValidity()||!Object.hasOwn(plans,field('plan').value))return;
  const clean=value=>value.trim().replace(/[\r\n]+/g,' ');
  const message=[
   '💌 ¡Hola, Click! Acepto!',
   'Queremos consultar por una invitación para nuestra boda.',
   '',
   `💍 Novios: ${clean(field('nombre1').value)} y ${clean(field('nombre2').value)}`,
   `✨ Plan de interés: ${plans[field('plan').value]}`,
   `🎨 Diseño de interés: ${designs[field('diseno').value]||'Aún por definir'}`,
   '',
   '📝 Comentarios:',
   field('comentarios').value.trim()||'Sin comentarios adicionales.',
   '',
   '¡Gracias! 🤍'
  ].join('\n');
  window.location.assign('https://wa.me/541178281814?text='+encodeURIComponent(message));
 });
})();
