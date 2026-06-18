/* LifeOS – GSAP Animations + Lenis Smooth Scroll */
(function(){
  // Lenis smooth scroll
  if(typeof Lenis!=='undefined'){
    const lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smooth:true});
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(typeof ScrollTrigger!=='undefined') lenis.on('scroll',ScrollTrigger.update);
  }

  // GSAP setup
  if(typeof gsap==='undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if(typeof TextPlugin!=='undefined') gsap.registerPlugin(TextPlugin);

  // Nav scroll effect
  const nav=document.getElementById('mainNav');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});

  // Custom Cursor
  const dot=document.getElementById('cursorDot');
  const ring=document.getElementById('cursorRing');
  let cx=0,cy=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{ cx=e.clientX; cy=e.clientY; });
  (function moveCursor(){
    if(dot){ dot.style.left=cx+'px'; dot.style.top=cy+'px'; }
    if(ring){ rx+=(cx-rx)*0.12; ry+=(cy-ry)*0.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; }
    requestAnimationFrame(moveCursor);
  })();

  // Mobile nav toggle
  const toggle=document.getElementById('navToggle');
  const mobileNav=document.getElementById('mobileNav');
  toggle?.addEventListener('click',()=>{
    const open=mobileNav.classList.toggle('open');
    toggle.classList.toggle('active',open);
    toggle.setAttribute('aria-expanded',open);
  });
  document.querySelectorAll('.mobile-nav-link').forEach(l=>l.addEventListener('click',()=>{
    mobileNav.classList.remove('open');
    toggle.classList.remove('active');
  }));

  // Intersection Observer for reveals
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
  },{threshold:0.1,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal-up,.reveal-card').forEach((el,i)=>{
    el.style.transitionDelay=(i%5)*0.08+'s';
    observer.observe(el);
  });

  // GSAP Hero entrance
  gsap.from('.hero-badge',{duration:1,y:30,opacity:0,delay:0.3,ease:'power3.out'});
  gsap.from('.hero-title-large',{duration:1.2,y:60,opacity:0,delay:0.5,ease:'power3.out'});
  gsap.from('.hero-subtitle',{duration:1,y:20,opacity:0,delay:0.8,ease:'power3.out'});
  gsap.from('.hero-cta',{duration:0.8,y:20,opacity:0,delay:1,ease:'power3.out'});
  gsap.from('.hero-stats',{duration:0.8,y:20,opacity:0,delay:1.2,ease:'power3.out'});

  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*0.35;
      const y=(e.clientY-r.top-r.height/2)*0.35;
      gsap.to(btn,{x,y,duration:0.4,ease:'power2.out'});
    });
    btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:0.5,ease:'elastic.out(1,0.5)'}));
  });

  // Ripple effect on buttons
  document.querySelectorAll('.btn-primary,.btn-ghost').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const r=btn.getBoundingClientRect();
      const ripple=document.createElement('span');
      ripple.className='ripple-effect';
      const size=Math.max(r.width,r.height)*1.5;
      ripple.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      btn.appendChild(ripple);
      setTimeout(()=>ripple.remove(),700);
    });
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const t=document.querySelector(a.getAttribute('href'));
      if(t){ t.scrollIntoView({behavior:'smooth',block:'start'}); mobileNav?.classList.remove('open'); toggle?.classList.remove('active'); }
    });
  });

  // VanillaTilt
  if(typeof VanillaTilt!=='undefined'){
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'),{max:8,speed:400,glare:true,'max-glare':0.15,perspective:1000});
  }
})();
