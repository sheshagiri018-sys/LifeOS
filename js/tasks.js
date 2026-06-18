/* LifeOS – Task Management */
(function(){
  let tasks=DB.get('tasks',[]);
  const periods=['morning','afternoon','evening','night'];

  function saveTasks(){ DB.set('tasks',tasks); updateSummary(); updateAnalyticsStats(); }

  function renderTasks(){
    periods.forEach(p=>{
      const container=document.getElementById(p+'Tasks');
      const countEl=document.getElementById(p+'Count');
      if(!container) return;
      const ptasks=tasks.filter(t=>t.period===p);
      countEl.textContent=ptasks.length;
      container.innerHTML='';
      ptasks.forEach(t=>{
        const div=document.createElement('div');
        div.className='task-item'+(t.done?' done':'');
        div.innerHTML=`
          <div class="task-check" data-id="${t.id}" role="checkbox" aria-checked="${t.done}" tabindex="0"></div>
          <span class="task-text">${escHtml(t.text)}</span>
          <span class="task-priority ${t.priority}">${t.priority}</span>
          <button class="task-delete" data-del="${t.id}" aria-label="Delete task">✕</button>`;
        container.appendChild(div);
      });
    });
    updateSummary();
    checkAllDone();
  }

  function updateSummary(){
    const total=tasks.length, done=tasks.filter(t=>t.done).length;
    document.getElementById('totalTasks').textContent=total;
    document.getElementById('doneTasks').textContent=done;
    document.getElementById('pendingTasks').textContent=total-done;
    document.getElementById('statTasks').textContent=done;
  }

  function checkAllDone(){
    if(tasks.length>0 && tasks.every(t=>t.done)){
      const ov=document.getElementById('celebrationOverlay');
      if(ov){ ov.classList.add('show'); launchConfetti(); setTimeout(()=>ov.classList.remove('show'),4000); }
    }
  }

  function launchConfetti(){
    const container=document.getElementById('confettiContainer');
    if(!container) return;
    container.innerHTML='';
    const colors=['#a78bfa','#06b6d4','#34d399','#fbbf24','#f43f5e'];
    for(let i=0;i<80;i++){
      const c=document.createElement('div');
      c.style.cssText=`position:absolute;width:${Math.random()*8+4}px;height:${Math.random()*8+4}px;background:${colors[Math.floor(Math.random()*5)]};border-radius:${Math.random()>0.5?'50%':'2px'};left:${Math.random()*100}%;top:50%;animation:confettiFall ${Math.random()*2+1}s ease-out forwards;animation-delay:${Math.random()*0.5}s;`;
      container.appendChild(c);
    }
  }

  function addTask(){
    const input=document.getElementById('taskInput');
    const text=input.value.trim();
    if(!text) return;
    const period=document.getElementById('taskPeriod').value;
    const priority=document.getElementById('taskPriority').value;
    tasks.push({id:Date.now(),text,period,priority,done:false,created:new Date().toISOString()});
    saveTasks(); renderTasks(); input.value=''; input.focus();
    rippleBtn(document.getElementById('addTaskBtn'));
  }

  document.getElementById('addTaskBtn')?.addEventListener('click',addTask);
  document.getElementById('taskInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter') addTask(); });

  document.addEventListener('click',e=>{
    if(e.target.classList.contains('task-check')||e.target.closest('.task-check')){
      const el=e.target.closest('[data-id]')||e.target;
      const id=+(el.dataset.id||el.closest('[data-id]')?.dataset.id);
      const task=tasks.find(t=>t.id===id);
      if(task){ task.done=!task.done; saveTasks(); renderTasks(); updateStreak&&updateStreak(); }
    }
    if(e.target.dataset.del){
      const id=+e.target.dataset.del;
      tasks=tasks.filter(t=>t.id!==id);
      saveTasks(); renderTasks();
    }
  });

  function escHtml(s){ const d=document.createElement('div');d.textContent=s;return d.innerHTML; }
  function rippleBtn(btn){ if(!btn) return; const r=document.createElement('span');r.className='ripple-effect';r.style.cssText='width:120px;height:120px;left:50%;top:50%;transform:translate(-50%,-50%)';btn.appendChild(r);setTimeout(()=>r.remove(),700); }

  renderTasks();
  window.updateAnalyticsStats=function(){
    const done=tasks.filter(t=>t.done).length;
    const el=document.getElementById('statTasks');
    if(el) el.textContent=done;
  };

  // Confetti keyframe injection
  const style=document.createElement('style');
  style.textContent='@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(200px) rotate(720deg);opacity:0}}';
  document.head.appendChild(style);
})();
