(function(){
  'use strict';
  const hamburger=document.getElementById('hamburger');
  const mobileNav=document.getElementById('mobileNav');
  function closeMenu(){ if(!hamburger||!mobileNav) return; hamburger.classList.remove('open'); mobileNav.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  function openMenu(){ hamburger.classList.add('open'); mobileNav.classList.add('open'); hamburger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  if(hamburger&&mobileNav){ hamburger.addEventListener('click',()=> mobileNav.classList.contains('open')?closeMenu():openMenu()); mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu)); document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeMenu(); }); }
  const header=document.querySelector('.site-header');
  function onScroll(){ if(header) header.classList.toggle('scrolled', window.scrollY>12); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  document.querySelectorAll('form').forEach(form=>{ form.addEventListener('submit',()=>{ const btn=form.querySelector('button[type="submit"]'); if(btn){ setTimeout(()=>{btn.disabled=true; btn.dataset.originalText=btn.textContent; btn.textContent=document.documentElement.lang==='es'?'Enviando...':'Sending...';},25); } }); });
})();
