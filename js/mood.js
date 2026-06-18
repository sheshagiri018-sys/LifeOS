/* LifeOS – Mood Tracker */
(function(){
  let moodLog=DB.get('mood_log',[]);
  const moodColors={happy:'rgba(167,139,250,0.8)',focused:'rgba(6,182,212,0.8)',productive:'rgba(52,211,153,0.8)',relaxed:'rgba(251,191,36,0.8)',busy:'rgba(244,63,94,0.8)',tired:'rgba(148,163,184,0.8)'};
  const days7=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  function logMood(m){
    moodLog.unshift({mood:m,date:new Date().toISOString()});
    if(moodLog.length>365) moodLog=moodLog.slice(0,365);
    DB.set('mood_log',moodLog);
    document.querySelectorAll('.mood-log-btn').forEach(b=>b.classList.toggle('active',b.dataset.m===m));
    renderMoodCharts();
  }

  document.querySelectorAll('.mood-log-btn').forEach(btn=>{
    btn.addEventListener('click',()=>logMood(btn.dataset.m));
  });

  function renderMoodCharts(){
    renderWeeklyMood();
    renderMoodDoughnut();
  }

  function renderWeeklyMood(){
    const ctx=document.getElementById('moodChart');
    if(!ctx||typeof Chart==='undefined') return;
    if(ctx._chart) ctx._chart.destroy();
    const last7=moodLog.slice(0,7).reverse();
    const data=last7.map(e=>({happy:5,focused:4,productive:4.5,relaxed:3,busy:3.5,tired:2}[e.mood]||3));
    const bgColors=last7.map(e=>moodColors[e.mood]||'rgba(167,139,250,0.5)');
    ctx._chart=new Chart(ctx,{
      type:'bar',
      data:{labels:days7,datasets:[{data:data.length?data:[0,0,0,0,0,0,0],backgroundColor:data.length?bgColors:Array(7).fill('rgba(255,255,255,0.05)'),borderRadius:8,borderWidth:0}]},
      options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>{const map={5:'Happy',4:'Focused',4.5:'Productive',3:'Relaxed',3.5:'Busy',2:'Tired'};return map[c.raw]||''}}}},scales:{y:{min:0,max:6,ticks:{color:'rgba(255,255,255,0.3)',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}},x:{ticks:{color:'rgba(255,255,255,0.3)',font:{size:10}},grid:{display:false}}},animation:{duration:800}}
    });
  }

  function renderMoodDoughnut(){
    const ctx=document.getElementById('moodDoughnut');
    if(!ctx||typeof Chart==='undefined') return;
    if(ctx._chart) ctx._chart.destroy();
    const counts={};
    moodLog.forEach(e=>{ counts[e.mood]=(counts[e.mood]||0)+1; });
    const labels=Object.keys(counts).map(k=>moodEmojis[k]+' '+k);
    const data=Object.values(counts);
    const colors=Object.keys(counts).map(k=>moodColors[k]);
    if(data.length===0){ labels.push('No data'); data.push(1); colors.push('rgba(255,255,255,0.05)'); }
    ctx._chart=new Chart(ctx,{
      type:'doughnut',
      data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:0,borderRadius:6}]},
      options:{plugins:{legend:{position:'bottom',labels:{color:'rgba(255,255,255,0.5)',font:{size:10},padding:12,boxWidth:12}}},cutout:'60%',animation:{duration:800}}
    });
  }

  renderMoodCharts();
})();
