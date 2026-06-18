/* LifeOS – Daily Journal */
(function(){
  let entries=DB.get('journal',[]);
  let selectedMood='happy';

  const textarea=document.getElementById('journalEntry');
  const timeline=document.getElementById('journalTimeline');
  const empty=document.getElementById('timelineEmpty');

  // Word count
  textarea?.addEventListener('input',()=>{
    const words=textarea.value.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('wordCount').textContent=words+' word'+(words!==1?'s':'');
  });

  // Mood selector
  document.querySelectorAll('.mood-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      selectedMood=btn.dataset.mood;
    });
  });

  function saveEntry(){
    const text=textarea.value.trim();
    if(!text) return;
    const entry={id:Date.now(),text,mood:selectedMood,date:new Date().toISOString()};
    entries.unshift(entry);
    DB.set('journal',entries);
    textarea.value='';
    document.getElementById('wordCount').textContent='0 words';
    renderTimeline();
    updateJournalStat();
    // Streak update
    let streak=DB.get('streak',0);
    const last=DB.get('last_journal_date','');
    const today=new Date().toDateString();
    if(last!==today){ streak++; DB.set('streak',streak); DB.set('last_journal_date',today); window.updateStreak&&window.updateStreak(); }
  }

  function renderTimeline(){
    if(!timeline) return;
    timeline.innerHTML='';
    if(entries.length===0){ timeline.appendChild(empty||createEmpty()); return; }
    entries.slice(0,20).forEach(e=>{
      const d=new Date(e.date);
      const dateStr=d.toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
      const div=document.createElement('div');
      div.className='timeline-entry';
      div.innerHTML=`
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-card-header">
            <span class="timeline-mood">${moodEmojis[e.mood]||'😊'}</span>
            <span class="timeline-date">${dateStr}</span>
            <button class="task-delete" data-jdel="${e.id}" aria-label="Delete entry" style="margin-left:auto">✕</button>
          </div>
          <div class="timeline-text">${escHtml(e.text)}</div>
        </div>`;
      timeline.appendChild(div);
    });
  }
  function createEmpty(){ const d=document.createElement('div');d.className='timeline-empty';d.innerHTML='<div class="empty-icon">📓</div><p>Your journal is waiting for its first entry.</p>';return d; }
  function updateJournalStat(){ const el=document.getElementById('statJournal');if(el)el.textContent=entries.length; }
  function escHtml(s){ const d=document.createElement('div');d.textContent=s;return d.innerHTML; }

  document.getElementById('saveJournalBtn')?.addEventListener('click',saveEntry);
  document.addEventListener('click',e=>{
    if(e.target.dataset.jdel){
      const id=+e.target.dataset.jdel;
      entries=entries.filter(e=>e.id!==id);
      DB.set('journal',entries);
      renderTimeline();
      updateJournalStat();
    }
  });

  renderTimeline();
  updateJournalStat();
})();
