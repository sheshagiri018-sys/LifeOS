/* LifeOS – Pomodoro Focus Timer */
(function(){
  let duration=25*60, remaining=25*60, isRunning=false, interval=null;
  let sessions=DB.get('focus_sessions',0);
  let minutes=DB.get('focus_minutes',0);
  const totalCirc=678.6;

  const display=document.getElementById('timerDisplay');
  const sessionLabel=document.getElementById('timerSession');
  const progressEl=document.getElementById('timerProgress');
  const iconEl=document.getElementById('timerIcon');

  function fmt(s){ return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60; }

  function setMode(mins,label){
    pause(); duration=mins*60; remaining=duration;
    if(display) display.textContent=fmt(remaining);
    if(sessionLabel) sessionLabel.textContent=label;
    updateRing();
  }

  function updateRing(){
    if(!progressEl) return;
    const pct=remaining/duration;
    progressEl.style.strokeDashoffset=totalCirc*(1-pct);
  }

  function tick(){
    if(remaining<=0){ completeSession(); return; }
    remaining--;
    if(display) display.textContent=fmt(remaining);
    updateRing();
  }

  function start(){
    if(isRunning) return;
    isRunning=true;
    interval=setInterval(tick,1000);
    iconEl.innerHTML='<rect x="5" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="15" y="4" width="4" height="16" rx="1" fill="currentColor"/>';
  }
  function pause(){
    isRunning=false; clearInterval(interval);
    iconEl.innerHTML='<polygon points="6,4 20,12 6,20" fill="currentColor"/>';
  }
  function reset(){ pause(); remaining=duration; if(display) display.textContent=fmt(remaining); updateRing(); }

  function completeSession(){
    pause(); sessions++; minutes+=Math.floor(duration/60);
    DB.set('focus_sessions',sessions); DB.set('focus_minutes',minutes);
    document.getElementById('todaySessions').textContent=sessions;
    document.getElementById('todayMinutes').textContent=minutes;
    renderSessionDots();
    window.updateFocusStat&&window.updateFocusStat();
    remaining=0; if(display) display.textContent='Done!';
    setTimeout(reset,2000);
    showNotif('Focus session complete! 🎉');
  }

  function renderSessionDots(){
    const el=document.getElementById('sessionsDots'); if(!el) return;
    el.innerHTML='';
    for(let i=0;i<4;i++){
      const d=document.createElement('div');
      d.className='session-dot'+(i<sessions%4?' done':'');
      el.appendChild(d);
    }
  }

  function showNotif(msg){
    if('Notification' in window && Notification.permission==='granted') new Notification('LifeOS',{body:msg});
    else { const n=document.createElement('div'); n.style.cssText='position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#a78bfa,#06b6d4);color:#fff;padding:12px 20px;border-radius:12px;font-size:0.9rem;z-index:9999;box-shadow:0 8px 32px rgba(167,139,250,0.4);animation:slideUp 0.4s ease'; n.textContent=msg; document.body.appendChild(n); setTimeout(()=>n.remove(),3500); }
  }

  document.getElementById('timerToggle')?.addEventListener('click',()=>isRunning?pause():start());
  document.getElementById('timerReset')?.addEventListener('click',reset);
  document.getElementById('timerSkip')?.addEventListener('click',completeSession);

  document.querySelectorAll('.timer-mode-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.timer-mode-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const m=+btn.dataset.mode;
      const labels={25:'Pomodoro',50:'Deep Work',5:'Short Break',15:'Long Break'};
      setMode(m,labels[m]||'Focus');
    });
  });

  // Ambient sounds via AudioContext
  let audioCtx=null, gainNode=null, sourceNode=null, activeSound=null;
  function playAmbient(type){
    if(activeSound===type){ stopAmbient(); return; }
    stopAmbient();
    try{
      audioCtx=new(window.AudioContext||window.webkitAudioContext)();
      gainNode=audioCtx.createGain();
      gainNode.gain.value=+document.getElementById('volumeSlider').value;
      gainNode.connect(audioCtx.destination);
      const buf=audioCtx.createBuffer(1,audioCtx.sampleRate*3,audioCtx.sampleRate);
      const data=buf.getChannelData(0);
      const freqMap={rain:0.8,ocean:0.5,forest:0.3,cafe:1.2};
      const freq=freqMap[type]||0.5;
      for(let i=0;i<data.length;i++){
        data[i]=(Math.random()*2-1)*0.15*Math.sin(i*freq*0.01+Math.random()*0.1);
      }
      sourceNode=audioCtx.createBufferSource();
      sourceNode.buffer=buf; sourceNode.loop=true;
      sourceNode.connect(gainNode); sourceNode.start();
      activeSound=type;
      document.querySelectorAll('.ambient-btn').forEach(b=>b.classList.toggle('active',b.dataset.sound===type));
    } catch(e){ console.log('Audio not available'); }
  }
  function stopAmbient(){
    try{ sourceNode?.stop(); audioCtx?.close(); }catch(e){}
    sourceNode=null; audioCtx=null; gainNode=null; activeSound=null;
    document.querySelectorAll('.ambient-btn').forEach(b=>b.classList.remove('active'));
  }
  document.querySelectorAll('.ambient-btn').forEach(btn=>btn.addEventListener('click',()=>playAmbient(btn.dataset.sound)));
  document.getElementById('volumeSlider')?.addEventListener('input',e=>{ if(gainNode) gainNode.gain.value=+e.target.value; });

  // Init
  document.getElementById('todaySessions').textContent=sessions;
  document.getElementById('todayMinutes').textContent=minutes;
  if(display) display.textContent=fmt(remaining);
  updateRing(); renderSessionDots();
  if('Notification' in window && Notification.permission==='default') Notification.requestPermission();
})();
