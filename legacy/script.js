(function(){
  const menuButton=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#main-nav');
  function closeMenu(){if(!nav||!menuButton)return;nav.classList.remove('show');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu');document.body.classList.remove('menu-open')}
  if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('show');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');document.body.classList.toggle('menu-open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));window.addEventListener('resize',()=>{if(window.innerWidth>1020)closeMenu()})}
  const tabs=[...document.querySelectorAll('.tab')];
  const panels=[...document.querySelectorAll('.service-panel')];
  function openTab(tabId){tabs.forEach(tab=>{const active=tab.dataset.tab===tabId;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});panels.forEach(panel=>{panel.hidden=panel.id!==`panel-${tabId}`})}
  tabs.forEach((tab,i)=>{tab.tabIndex=i===0?0:-1;tab.addEventListener('click',()=>openTab(tab.dataset.tab));tab.addEventListener('keydown',event=>{if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;event.preventDefault();const current=tabs.indexOf(tab);const next=(current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;openTab(tabs[next].dataset.tab);tabs[next].focus()})});
  document.querySelectorAll('[data-open-tab]').forEach(a=>a.addEventListener('click',()=>openTab(a.dataset.openTab)));
  const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
  // Netlify détecte les formulaires statiques lors du déploiement. Une copie locale (fichier ou serveur local) est une démonstration, pas un serveur d'envoi.
  const isLocalPreview=location.protocol==='file:'||['localhost','127.0.0.1','[::1]','::1'].includes(location.hostname);
  document.querySelectorAll('form[data-netlify]').forEach(form=>form.addEventListener('submit',event=>{if(isLocalPreview){event.preventDefault();alert('Le formulaire est prêt. Pour recevoir les demandes, il faut publier le site sur Netlify et activer les notifications de formulaire. Consultez le fichier README.md.')}}));
})();
