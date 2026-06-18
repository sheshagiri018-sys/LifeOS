/* LifeOS – App Init & Utility */
(function(){
  // Theme init
  document.documentElement.setAttribute('data-theme','dark');

  // Request notification permission
  if('Notification' in window && Notification.permission==='default'){
    setTimeout(()=>Notification.requestPermission(),3000);
  }

  // Register service worker for offline (GitHub Pages compatible)
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.getElementById('noteModal')?.classList.remove('open');
      document.getElementById('celebrationOverlay')?.classList.remove('show');
    }
  });

  // Section progress indicators via scroll
  window.addEventListener('scroll',()=>{
    const doc=document.documentElement;
    const pct=(doc.scrollTop/(doc.scrollHeight-doc.clientHeight))*100;
    document.documentElement.style.setProperty('--scroll-progress',pct+'%');
  },{passive:true});

  console.log('%c LifeOS 🚀 ', 'background:linear-gradient(135deg,#a78bfa,#06b6d4);color:#fff;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:8px;');
  console.log('%c Your digital life, unified.', 'color:#a78bfa;font-size:12px;');
})();
