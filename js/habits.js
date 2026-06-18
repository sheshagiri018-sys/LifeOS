/* LifeOS – Habit Tracker */
(function(){
  let habits=DB.get('habits',[]);
  let selectedIcon='💪';

  function saveHabits(){ DB.set('habits',habits); }

  function renderHabits(){
    const list=document.getElementById('habitsList'); if(!list) return;
    list.innerHTML='';
    if(habits.length===0){
      list.innerHTML='<div style="color:var(--text-muted);font-size:0.9rem;padding:2rem">No habits yet. Add your first habit!</div>';
      return;
    }
    const weekDays=['M','T','W','T','F','S','S'];
    const today=new Date().getDay();
    habits.forEach(h=>{
      const item=document.createElement('div');
      item.className='habit-item';
      const streak=h.days?h.days.filter(Boolean).length:0;
      item.innerHTML=`
        <div class="habit-header">
          <span class="habit-icon">${h.icon}</span>
          <span class="habit-name">${escHtml(h.name)}</span>
          <span class="habit-streak">🔥 ${streak} day streak</span>
          <button class="habit-delete" data-hdel="${h.id}" aria-label="Delete habit">✕</button>
        </div>
        <div class="habit-week">
          ${weekDays.map((d,i)=>`<div class="habit-day${h.days&&h.days[i]?' done':''}" data-hid="${h.id}" data-day="${i}" title="${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}">${d}</div>`).join('')}
        </div>`;
      list.appendChild(item);
    });
    countHabitsDoneToday();
  }

  function countHabitsDoneToday(){
    const today=new Date().getDay();
    const di=today===0?6:today-1;
    const done=habits.filter(h=>h.days&&h.days[di]).length;
    DB.set('habits_done_today',habits.length?Math.round((done/habits.length)*5):0);
  }

  document.getElementById('addHabitBtn')?.addEventListener('click',()=>{
    const name=document.getElementById('habitTitle').value.trim();
    if(!name) return;
    habits.push({id:Date.now(),name,icon:selectedIcon,days:[false,false,false,false,false,false,false]});
    saveHabits(); renderHabits();
    document.getElementById('habitTitle').value='';
  });

  document.querySelectorAll('.habit-icon-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.habit-icon-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      selectedIcon=btn.dataset.icon;
    });
  });

  document.addEventListener('click',e=>{
    if(e.target.dataset.hid!==undefined&&e.target.dataset.day!==undefined){
      const id=+e.target.dataset.hid, day=+e.target.dataset.day;
      const h=habits.find(x=>x.id===id);
      if(h){ h.days[day]=!h.days[day]; saveHabits(); renderHabits(); }
    }
    if(e.target.dataset.hdel){
      habits=habits.filter(h=>h.id!==+e.target.dataset.hdel);
      saveHabits(); renderHabits();
    }
  });

  function escHtml(s){ const d=document.createElement('div');d.textContent=s;return d.innerHTML; }

  if(habits.length===0){
    habits=[
      {id:1,name:'Morning Workout',icon:'💪',days:[true,true,false,true,true,false,false]},
      {id:2,name:'Read 30 minutes',icon:'📚',days:[true,true,true,true,false,true,true]},
      {id:3,name:'Drink 8 glasses',icon:'💧',days:[true,false,true,true,true,false,true]}
    ];
    saveHabits();
  }
  renderHabits();
})();
