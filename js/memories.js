/* LifeOS – Memory Gallery */
(function(){
  let memories=DB.get('memories',[]);
  function saveMemories(){ DB.set('memories',memories); }
  function escHtml(s){ const d=document.createElement('div');d.textContent=s;return d.innerHTML; }
  function formatDate(iso){ if(!iso) return ''; const d=new Date(iso); return d.toLocaleDateString('en-IN',{month:'long',day:'numeric',year:'numeric'}); }

  function renderMemories(){
    const grid=document.getElementById('memoryGrid'); if(!grid) return;
    grid.innerHTML='';
    if(memories.length===0){
      grid.innerHTML='<div class="memory-empty">Your achievement gallery is empty.<br>Add your first win! 🏆</div>';
      return;
    }
    memories.forEach(m=>{
      const card=document.createElement('div');
      card.className='memory-card';
      card.innerHTML=`
        <button class="memory-card-delete" data-mdel="${m.id}" aria-label="Delete memory">✕</button>
        <div class="memory-emoji">${m.emoji}</div>
        <div class="memory-card-title">${escHtml(m.title)}</div>
        <div class="memory-card-desc">${escHtml(m.desc)}</div>
        <div class="memory-card-date">${formatDate(m.date)}</div>`;
      grid.appendChild(card);
    });
  }

  document.getElementById('addMemoryBtn')?.addEventListener('click',()=>{
    const title=document.getElementById('memoryTitle').value.trim();
    const desc=document.getElementById('memoryDesc').value.trim();
    if(!title) return;
    const emoji=memoryEmojis[Math.floor(Math.random()*memoryEmojis.length)];
    memories.unshift({id:Date.now(),title,desc,emoji,date:new Date().toISOString()});
    saveMemories(); renderMemories();
    document.getElementById('memoryTitle').value='';
    document.getElementById('memoryDesc').value='';
  });

  document.addEventListener('click',e=>{
    if(e.target.dataset.mdel){
      memories=memories.filter(m=>m.id!==+e.target.dataset.mdel);
      saveMemories(); renderMemories();
    }
  });

  if(memories.length===0){
    memories=[
      {id:1,title:'Launched First Website',desc:'Built and deployed my first production website.',emoji:'🚀',date:new Date(Date.now()-86400000*10).toISOString()},
      {id:2,title:'Completed 30-Day Challenge',desc:'Coded every single day for 30 days straight.',emoji:'🔥',date:new Date(Date.now()-86400000*5).toISOString()},
      {id:3,title:'Open Source Contribution',desc:'Got my first PR merged into an open source project.',emoji:'⭐',date:new Date(Date.now()-86400000*2).toISOString()}
    ];
    saveMemories();
  }
  renderMemories();
})();
