/* LifeOS – Smart Notes */
(function(){
  let notes=DB.get('notes',[]);
  let editId=null;
  let activeFilter='all';

  const modal=document.getElementById('noteModal');
  const grid=document.getElementById('notesGrid');

  function saveNotes(){ DB.set('notes',notes); document.getElementById('statNotes').textContent=notes.length; }

  function renderNotes(){
    const search=document.getElementById('notesSearch')?.value.toLowerCase()||'';
    let filtered=notes.filter(n=>{
      const matchCat=activeFilter==='all'||n.category===activeFilter;
      const matchSearch=!search||n.title.toLowerCase().includes(search)||n.content.toLowerCase().includes(search);
      return matchCat&&matchSearch;
    });
    grid.innerHTML='';
    if(filtered.length===0){
      grid.innerHTML='<div style="color:var(--text-muted);font-size:0.9rem;padding:2rem;grid-column:1/-1">No notes found. Create your first note!</div>';
      return;
    }
    filtered.forEach(n=>{
      const card=document.createElement('div');
      card.className='note-card';
      card.dataset.cat=n.category;
      const catLabels={quick:'⚡ Quick',study:'📚 Study',project:'🚀 Project',personal:'🌿 Personal',ideas:'💡 Ideas'};
      card.innerHTML=`
        <button class="note-card-delete" data-del="${n.id}" aria-label="Delete note">✕</button>
        <div class="note-card-category">${catLabels[n.category]||n.category}</div>
        <div class="note-card-title">${escHtml(n.title)}</div>
        <div class="note-card-content">${escHtml(n.content)}</div>
        <div class="note-card-footer">
          ${n.tag?`<span class="note-tag">#${escHtml(n.tag)}</span>`:''}
          <span class="note-date">${formatDate(n.created)}</span>
        </div>`;
      card.addEventListener('click',ev=>{ if(!ev.target.dataset.del) openEdit(n); });
      grid.appendChild(card);
    });
  }

  function openModal(id=null){
    editId=id;
    if(id){
      const n=notes.find(x=>x.id===id);
      if(n){
        document.getElementById('noteTitleInput').value=n.title;
        document.getElementById('noteContentInput').value=n.content;
        document.getElementById('noteCategoryInput').value=n.category;
        document.getElementById('noteTagInput').value=n.tag||'';
      }
    } else {
      document.getElementById('noteTitleInput').value='';
      document.getElementById('noteContentInput').value='';
      document.getElementById('noteCategoryInput').value='quick';
      document.getElementById('noteTagInput').value='';
    }
    modal.classList.add('open');
    setTimeout(()=>document.getElementById('noteTitleInput').focus(),100);
  }
  function openEdit(n){ openModal(n.id); }
  function closeModal(){ modal.classList.remove('open'); editId=null; }

  function saveNote(){
    const title=document.getElementById('noteTitleInput').value.trim();
    const content=document.getElementById('noteContentInput').value.trim();
    const category=document.getElementById('noteCategoryInput').value;
    const tag=document.getElementById('noteTagInput').value.replace(/^#/,'').trim();
    if(!title&&!content) return;
    if(editId){
      const n=notes.find(x=>x.id===editId);
      if(n){ n.title=title;n.content=content;n.category=category;n.tag=tag;n.updated=new Date().toISOString(); }
    } else {
      notes.unshift({id:Date.now(),title,content,category,tag,created:new Date().toISOString()});
    }
    saveNotes(); renderNotes(); closeModal();
  }

  document.getElementById('addNoteBtn')?.addEventListener('click',()=>openModal());
  document.getElementById('noteModalClose')?.addEventListener('click',closeModal);
  document.getElementById('saveNoteBtn')?.addEventListener('click',saveNote);
  modal?.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });

  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter=btn.dataset.filter;
      renderNotes();
    });
  });

  document.getElementById('notesSearch')?.addEventListener('input',renderNotes);

  document.addEventListener('click',e=>{
    if(e.target.dataset.del&&e.target.closest('#notesGrid')){
      const id=+e.target.dataset.del;
      notes=notes.filter(n=>n.id!==id);
      saveNotes(); renderNotes();
    }
  });

  function escHtml(s){ const d=document.createElement('div');d.textContent=s;return d.innerHTML; }
  function formatDate(iso){ if(!iso) return ''; const d=new Date(iso); return d.toLocaleDateString('en-IN',{month:'short',day:'numeric'}); }

  // Seed sample notes
  if(notes.length===0){
    notes=[
      {id:1,title:'Welcome to LifeOS',content:'This is your intelligent notes system. Create quick notes, study notes, project notes, and more.',category:'quick',tag:'welcome',created:new Date().toISOString()},
      {id:2,title:'Project Ideas',content:'Build a personal portfolio, start a side project, learn a new framework this month.',category:'ideas',tag:'projects',created:new Date().toISOString()},
      {id:3,title:'Study Plan',content:'Morning: DSA practice. Afternoon: System design. Evening: Review and revise.',category:'study',tag:'learning',created:new Date().toISOString()}
    ];
    saveNotes();
  }
  renderNotes();
  document.getElementById('statNotes').textContent=notes.length;
})();
