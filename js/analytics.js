/* LifeOS – Analytics & Heatmap */
(function(){
  function renderWeeklyChart(){
    const ctx=document.getElementById('weeklyChart');
    if(!ctx||typeof Chart==='undefined') return;
    if(ctx._chart) ctx._chart.destroy();
    const labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const tasks=DB.get('tasks',[]);
    const data=labels.map((_,i)=>Math.floor(Math.random()*8+2));
    ctx._chart=new Chart(ctx,{
      type:'bar',
      data:{labels,datasets:[{label:'Tasks',data,backgroundColor:'rgba(167,139,250,0.6)',borderRadius:8,borderWidth:0},{label:'Focus (hrs)',data:data.map(d=>+(d*0.4).toFixed(1)),backgroundColor:'rgba(6,182,212,0.5)',borderRadius:8,borderWidth:0}]},
      options:{plugins:{legend:{labels:{color:'rgba(255,255,255,0.5)',font:{size:11}}}},scales:{y:{ticks:{color:'rgba(255,255,255,0.3)',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}},x:{ticks:{color:'rgba(255,255,255,0.3)',font:{size:10}},grid:{display:false}}},animation:{duration:1000}}
    });
  }

  function renderMonthlyChart(){
    const ctx=document.getElementById('monthlyChart');
    if(!ctx||typeof Chart==='undefined') return;
    if(ctx._chart) ctx._chart.destroy();
    const labels=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data=labels.map(()=>Math.floor(Math.random()*60+20));
    ctx._chart=new Chart(ctx,{
      type:'line',
      data:{labels,datasets:[{label:'Productivity',data,borderColor:'rgba(167,139,250,0.9)',backgroundColor:'rgba(167,139,250,0.08)',fill:true,tension:0.4,pointBackgroundColor:'rgba(167,139,250,1)',pointRadius:4,pointHoverRadius:7,borderWidth:2}]},
      options:{plugins:{legend:{labels:{color:'rgba(255,255,255,0.5)',font:{size:11}}}},scales:{y:{ticks:{color:'rgba(255,255,255,0.3)',font:{size:10}},grid:{color:'rgba(255,255,255,0.04)'}},x:{ticks:{color:'rgba(255,255,255,0.3)',font:{size:10}},grid:{display:false}}},animation:{duration:1200}}
    });
  }

  function renderHeatmap(){
    const container=document.getElementById('heatmapContainer');
    if(!container) return;
    container.innerHTML='';
    const moodLog=DB.get('mood_log',[]);
    const tasks=DB.get('tasks',[]);
    const today=new Date();
    const weeks=26;
    const totalDays=weeks*7;
    for(let i=totalDays-1;i>=0;i--){
      const d=new Date(today);
      d.setDate(d.getDate()-i);
      const key=d.toDateString();
      const activity=Math.random(); // simulated; replace with real data
      const cell=document.createElement('div');
      cell.className='heatmap-cell';
      cell.title=`${d.toLocaleDateString('en-IN',{month:'short',day:'numeric'})}: ${activity>0.7?'High':activity>0.4?'Medium':activity>0.1?'Low':'None'} activity`;
      const opacity=activity>0.8?1:activity>0.6?0.7:activity>0.4?0.45:activity>0.15?0.2:0.08;
      cell.style.background=`rgba(167,139,250,${opacity})`;
      container.appendChild(cell);
    }
  }

  function updateFocusStat(){
    const sessions=DB.get('focus_sessions',0);
    const minutes=DB.get('focus_minutes',0);
    const el=document.getElementById('statFocus');
    if(el) el.textContent=minutes>=60?Math.floor(minutes/60)+'h '+minutes%60+'m':minutes+'m';
  }

  renderWeeklyChart();
  renderMonthlyChart();
  renderHeatmap();
  updateFocusStat();
  window.updateFocusStat=updateFocusStat;
})();
