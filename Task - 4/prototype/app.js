(function(){
  const flow = ['welcome','onboarding-1','onboarding-2','profile','goals','summary'];
  let state = {activity:null, preferences:[],profile:{},goals:[]};

  function show(screen){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const el = document.querySelector(`[data-screen="${screen}"]`);
    if(el) el.classList.add('active');
  }

  function idxOf(screen){return flow.indexOf(screen)}

  // Start button
  document.getElementById('start-btn').addEventListener('click',()=>show('onboarding-1'));

  // Onboarding options
  document.querySelectorAll('.option').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.option').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      state.activity = btn.dataset.value;
    });
  });

  // chips (preferences)
  document.querySelectorAll('.chip').forEach(ch=>{
    ch.addEventListener('click',()=>{
      ch.classList.toggle('selected');
      const val = ch.dataset.value;
      if(ch.classList.contains('selected')){
        if(!state.preferences.includes(val)) state.preferences.push(val);
      } else {
        state.preferences = state.preferences.filter(x=>x!==val);
      }
    });
  });

  // Back buttons
  document.querySelectorAll('.back').forEach(b=>b.addEventListener('click',()=>{
    const current = document.querySelector('.screen.active').dataset.screen;
    const i = idxOf(current);
    if(i>0) show(flow[i-1]);
  }));

  // Next buttons
  document.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>{
    const current = document.querySelector('.screen.active').dataset.screen;
    const i = idxOf(current);
    if(current==='onboarding-1' && !state.activity){
      alert('Please pick an activity level'); return;
    }
    if(i>=0 && i<flow.length-1) show(flow[i+1]);
  }));

  // to-goals (profile -> goals)
  document.getElementById('to-goals').addEventListener('click',()=>{
    const form = document.getElementById('profile-form');
    const data = new FormData(form);
    state.profile.name = data.get('name')||'User';
    state.profile.age = data.get('age');
    state.profile.height = data.get('height');
    state.profile.weight = data.get('weight');
    show('goals');
  });

  // goal selection (max 3)
  document.querySelectorAll('.goal').forEach(g=>{
    g.addEventListener('click',()=>{
      const val = g.dataset.goal;
      if(g.classList.contains('selected')){
        g.classList.remove('selected');
        state.goals = state.goals.filter(x=>x!==val);
      } else {
        if(state.goals.length>=3){
          alert('You can pick up to 3 goals'); return;
        }
        g.classList.add('selected');
        state.goals.push(val);
      }
    });
  });

  // finish -> summary
  document.getElementById('finish').addEventListener('click',()=>{
    if(state.goals.length===0){alert('Pick at least one goal');return}
    populateSummary();
    show('summary');
  });

  document.getElementById('start-app').addEventListener('click',()=>{
    alert('Prototype: Dashboard would open now.');
  });

  // Annotations toggle
  const annotationsText = `
  <h4>Welcome</h4>
  <p class="small">Clear hero + single call to action reduces friction for new users.</p>
  <h4>Activity level</h4>
  <p class="small">Asking about activity early helps personalize intensity and frequency.</p>
  <h4>Preferences</h4>
  <p class="small">Workout types are quick multi-select chips for fast choices.</p>
  <h4>Profile</h4>
  <p class="small">Collect minimal profile fields needed for tailored plans.</p>
  <h4>Goals</h4>
  <p class="small">Limit to 3 goals to avoid overwhelming the initial plan.</p>
  `;
  document.getElementById('annotations-content').innerHTML = annotationsText;

  document.getElementById('toggle-annotations').addEventListener('click',()=>{
    document.getElementById('annotations').classList.toggle('hidden');
  });

  function populateSummary(){
    const c = document.getElementById('summary-content');
    c.innerHTML = `<p><strong>Name:</strong> ${state.profile.name || ''}</p>`+
                  `<p><strong>Activity:</strong> ${state.activity || ''}</p>`+
                  `<p><strong>Preferences:</strong> ${state.preferences.join(', ') || '—'}</p>`+
                  `<p><strong>Goals:</strong> ${state.goals.join(', ')}</p>`;
  }
})();
