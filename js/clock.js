/* LifeOS – Live Clock */
(function(){
  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function pad(n){return String(n).padStart(2,'0');}
  function tick(){
    const now=new Date();
    const h=pad(now.getHours()),m=pad(now.getMinutes()),s=pad(now.getSeconds());
    const el=document.getElementById('clockTime');
    if(el) el.textContent=`${h}:${m}:${s}`;
    const de=document.getElementById('clockDate');
    if(de) de.textContent=`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    // Progress ring: seconds out of 60
    const prog=document.getElementById('clockProgress');
    if(prog){
      const circ=339.3;
      const offset=circ-(now.getSeconds()/60)*circ;
      prog.style.strokeDashoffset=offset;
    }
    // Journal date display
    const jd=document.getElementById('journalDateDisplay');
    if(jd) jd.textContent=`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }
  tick();
  setInterval(tick,1000);

  // Quote
  function loadQuote(){
    const q=quotes[Math.floor(Math.random()*quotes.length)];
    const qt=document.getElementById('dailyQuote');
    const qa=document.getElementById('quoteAuthor');
    if(qt) qt.textContent=q.text;
    if(qa) qa.textContent='— '+q.author;
  }
  loadQuote();
  const qr=document.getElementById('quoteRefresh');
  if(qr) qr.addEventListener('click',()=>{ qr.style.transform='rotate(360deg)'; setTimeout(()=>{ qr.style.transform=''; },400); loadQuote(); });

  // Streak
  function updateStreak(){
    const count=DB.get('streak',0);
    const el=document.getElementById('streakCount');
    if(el) el.textContent=count;
    const bar=document.getElementById('streakDays');
    if(bar){
      bar.innerHTML='';
      for(let i=0;i<7;i++){
        const d=document.createElement('div');
        d.className='streak-day'+(i<count%7?' active':'');
        bar.appendChild(d);
      }
    }
  }
  updateStreak();
  window.updateStreak=updateStreak;
})();
