// lightweight jobs helper used by index.html if present
(async function(){
  if(!document.getElementById('jobs-grid')) return;
  try{
    const res = await fetch('/api/v1/jobs?limit=8');
    if(!res.ok) throw new Error('API '+res.status);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.items || data.jobs || []);
    const jobsGrid = document.getElementById('jobs-grid');
    jobsGrid.innerHTML='';
    if(list.length===0){ jobsGrid.innerHTML='<div class="card">No jobs available</div>'; return }
    list.slice(0,8).forEach(job=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `\n        <div class="tag">${(job.type||'Job').toUpperCase()}</div>\n        <h3 style=\"margin:8px 0\">${job.title||job.role||'Untitled'}</h3>\n        <div style=\"color:var(--slate)\">${(job.employer&&job.employer.name)||job.company||'Unknown'} · ${job.location||job.city||'Remote'}</div>\n        <div style=\"margin-top:12px;display:flex;justify-content:space-between;align-items:center\">\n          <div style=\"font-size:13px;color:var(--slate)\">${job.salary||''}</div>\n          <a class=\"btn\" href=\"/jobs.html#job-${job.id||job.uuid||''}\">View</a>\n        </div>\n      `;
      jobsGrid.appendChild(div);
    });
  }catch(e){
    console.warn('Jobs API failed, falling back to static data', e);
    try{
      const res = await fetch('/data/jobs.json');
      const list = await res.json();
      const jobsGrid = document.getElementById('jobs-grid'); jobsGrid.innerHTML='';
      list.slice(0,8).forEach(job=>{ const div=document.createElement('div');div.className='card';div.innerHTML=`<div class="tag">${(job.type||'Job').toUpperCase()}</div><h3 style="margin:8px 0">${job.title}</h3><div style="color:var(--slate)">${job.employer.name} · ${job.location}</div><div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center"><div style="font-size:13px;color:var(--slate)">${job.salary||''}</div><a class="btn" href="/jobs.html#job-${job.id}">View</a></div>`;jobsGrid.appendChild(div) })
    }catch(ee){ console.error('Static fallback failed', ee) }
  }
})();
