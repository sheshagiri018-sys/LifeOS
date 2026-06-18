/* LifeOS – Goals */
(function(){
  let goals=DB.get('goals',[]);
  let activeCategory='short';

  function saveGoals(){ DB.set('goals',goals); }

  function renderGoals(){
    const grid=document.getElementById('goalsGrid');
    if(!grid) return;
    const filtered=goals.filter(g=>g.category===activeCategory);
    grid.innerHTML='';
    if(filtered.length===0){
      grid.innerHTML='<div style="color:var(--text-muted);font-size:0.9rem;padding:2rem">No goals yet. Add your first goal below!</div>';
      return;
    }
    filtered.forEach(g=>{
      const card=document.createElement('div');
      card.className='goal-card';
      const prog=Math.min(100,Math.max(0,+g.progress||0));
      card.innerHTML=`
        <button class="goal-delete" data-del="${g.id}" aria-label="Delete goal">✕</button>
        <div class="goal-category">${catLabel(g.category)}</div>
        <div class="goal-title">${escHtml(g.title)}</div>
        <div class="goal-desc">${escHtml(g.desc)}</div>
        <div class="goal-progress-bar"><div class="goal-progress-fill" style="width:${prog}%"></div></div>
        <div class="goal-progress-label"><span>Progress</span><span>${prog}%</span></div>`;
      grid.appendChild(card);
    });
  }

  function catLabel(c){ return {short:'🎯 Short-Term',long:'🌟 Long-Term',career:'💼 Career',learning:'📚 Learning'}[c]||c; }

  document.querySelectorAll('.goal-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.goal-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory=btn.dataset.category;
      renderGoals();
    });
  });

  document.getElementById('addGoalBtn')?.addEventListener('click',()=>{
    const title=document.getElementById('goalTitle').value.trim();
    const desc=document.getElementById('goalDesc').value.trim();
    const category=document.getElementById('goalCategory').value;
    const progress=document.getElementById('goalProgress').value||0;
    if(!title) return;
    goals.push({id:Date.now(),title,desc,category,progress:+progress,created:new Date().toISOString()});
    saveGoals();
    document.getElementById('goalTitle').value='';
    document.getElementById('goalDesc').value='';
    document.getElementById('goalProgress').value='';
    activeCategory=category;
    document.querySelectorAll('.goal-tab').forEach(b=>b.classList.toggle('active',b.dataset.category===category));
    renderGoals();
  });

  document.addEventListener('click',e=>{
    if(e.target.dataset.del&&e.target.closest('#goalsGrid')){
      const id=+e.target.dataset.del;
      goals=goals.filter(g=>g.id!==id);
      saveGoals(); renderGoals();
    }
  });

  function escHtml(s){ const d=document.createElement('div');d.textContent=s;return d.innerHTML; }

  // Seed
  if(goals.length===0){
    goals=[
      {id:1,title:'Launch Portfolio',desc:'Deploy my portfolio to GitHub Pages',category:'short',progress:65,created:new Date().toISOString()},
      {id:2,title:'Learn TypeScript',desc:'Complete TypeScript course and build a project',category:'learning',progress:40,created:new Date().toISOString()},
      {id:3,title:'Land First Dev Job',desc:'Apply to 10 companies this month',category:'career',progress:20,created:new Date().toISOString()},
      {id:4,title:'Build SaaS Product',desc:'Launch a profitable SaaS by end of year',category:'long',progress:10,created:new Date().toISOString()}
    ];
    saveGoals();
  }
  renderGoals();
})();
