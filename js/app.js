// frontend/js/app.js
// Fetch jobs from backend API and render them into #jobs-grid
(async function(){
  const jobsGrid = document.getElementById('jobs-grid');
  const stats = { jobs: document.getElementById('stat-jobs'), freelancers: document.getElementById('stat-freelancers'), vendors: document.getElementById('stat-vendors') };
  function el(html){ const div=document.createElement('div'); div.innerHTML=html.trim(); return div.firstChild; }

  try{
    const res = await fetch('/api/v1/jobs?limit=8');
    if(!res.ok) throw new Error('Jobs API error: '+res.status);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.items || data.jobs || []);

    // Render stats if provided
    if(data.meta){ stats.jobs.textContent = data.meta.total || list.length; }
    else { stats.jobs.textContent = list.length; }
    // Placeholder numbers for freelancers/vendors
    stats.freelancers.textContent = 1206;
    stats.vendors.textContent = 318;

    if(list.length === 0){ jobsGrid.innerHTML = '<div class="card">No jobs available</div>'; return; }

    jobsGrid.innerHTML = '';
    list.slice(0,8).forEach(job => {
      const tag = (job.type || 'Job').toUpperCase();
      const title = job.title || job.role || 'Untitled role';
      const company = (job.employer && job.employer.name) || job.company || 'Unknown';
      const location = job.location || job.city || 'Remote';
      const salary = job.salary || job.compensation || '';

      const card = el(`\n        <div class="card">\n          <div class="tag">${tag}</div>\n          <h3 style="margin:8px 0 6px">${title}</h3>\n          <div style="color:var(--slate);font-size:13px">${company} · ${location}</div>\n          <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">\n            <div style="font-size:13px;color:var(--slate)">${salary}</div>\n            <a href="/jobs.html#job-${job.id || job.uuid || ''}" class="btn">View</a>\n          </div>\n        </div>\n      `);
      jobsGrid.appendChild(card);
    });
  }catch(err){
    console.error(err);
    jobsGrid.innerHTML = '<div class="card">Unable to load jobs. Backend may be unavailable.</div>';
    stats.jobs.textContent = '—'; stats.freelancers.textContent='—'; stats.vendors.textContent='—';
  }
})();
