  // ── FIELDS MAP ──
  const FIELDS = [
    { inp: 'inp-personal',  out: 'cv-personal',  sec: 'sec-personal' },
    { inp: 'inp-summary',   out: 'cv-summary',   sec: 'sec-summary' },
    { inp: 'inp-education', out: 'cv-education', sec: 'sec-education' },
    { inp: 'inp-diplomas',  out: 'cv-diplomas',  sec: 'sec-diplomas' },
    { inp: 'inp-experience',out: 'cv-experience',sec: 'sec-experience' },
    { inp: 'inp-skills',    out: 'cv-skills',    sec: 'sec-skills' },
    { inp: 'inp-contact',   out: 'cv-contact',   sec: 'sec-contact' },
  ];

  function isArabic(str) {
    return /[\u0600-\u06FF]/.test(str);
  }

  function getDir() {
    const vals = ['inp-name','inp-title','inp-summary','inp-experience']
      .map(id => document.getElementById(id)?.value || '').join(' ');
    const hasAr = isArabic(vals);
    const hasLat = /[A-Za-z]/.test(vals);
    if (hasAr && !hasLat) return 'rtl';
    if (hasLat && !hasAr) return 'ltr';
    return 'rtl';
  }

  function update() {
    // Name
    const name = document.getElementById('inp-name').value.trim();
    document.getElementById('cv-name').textContent = name || 'اسمك الكامل';

    // Title
    const title = document.getElementById('inp-title').value.trim();
    const titleEl = document.getElementById('cv-title');
    titleEl.textContent = title;
    titleEl.style.display = title ? 'inline-block' : 'none';

    // Title translation
    const titleTr = document.getElementById('inp-title-tr').value.trim();
    const titleTrEl = document.getElementById('cv-title-tr');
    titleTrEl.textContent = titleTr;
    titleTrEl.style.display = titleTr ? 'block' : 'none';

    // Sections
    FIELDS.forEach(({ inp, out, sec }) => {
      const val = document.getElementById(inp).value.trim();
      document.getElementById(out).textContent = val;
      const secEl = document.getElementById(sec);
      if (val) secEl.classList.add('visible');
      else secEl.classList.remove('visible');
    });

    // Direction
    const dir = getDir();
    const doc = document.getElementById('cv-doc');
    doc.dir = dir;
  }

  // ── PHOTO ──
  document.getElementById('photo-btn').addEventListener('click', () => {
    document.getElementById('inp-photo').click();
  });

  document.getElementById('inp-photo').addEventListener('change', function() {
    const file = this.files[0];
    const wrap = document.getElementById('cv-photo-wrap');
    const img = document.getElementById('cv-photo-img');
    const status = document.getElementById('photo-status');

    if (file && file.type.startsWith('image/')) {
      img.src = URL.createObjectURL(file);
      wrap.classList.add('has-photo');
      status.classList.add('show');
    } else {
      img.src = '';
      wrap.classList.remove('has-photo');
      status.classList.remove('show');
    }
  });

  // ── INPUT LISTENERS ──
  ['inp-name','inp-title','inp-title-tr'].forEach(id => {
    document.getElementById(id).addEventListener('input', update);
  });
  FIELDS.forEach(({ inp }) => {
    document.getElementById(inp).addEventListener('input', update);
  });

  // ── PRINT ──
  function doPrint() {
    update();
    window.print();
  }

  document.getElementById('print-btn').addEventListener('click', doPrint);
  document.getElementById('print-btn-top').addEventListener('click', doPrint);

  // ── DARK MODE ──
  const darkBtn = document.getElementById('dark-toggle');
  function applyDark(on) {
    document.documentElement.classList.toggle('dark', on);
    document.body.classList.toggle('dark', on); // kept for compat
    darkBtn.querySelector('span').textContent = on ? 'الوضع الفاتح' : 'الوضع المظلم';
    darkBtn.textContent = '';
    darkBtn.innerHTML = on ? '☀️ <span>الوضع الفاتح</span>' : '🌙 <span>الوضع المظلم</span>';
    localStorage.setItem('cvTheme', on ? 'dark' : 'light');
  }

  darkBtn.addEventListener('click', () => {
    applyDark(!document.documentElement.classList.contains('dark'));
  });

  if (localStorage.getItem('cvTheme') === 'dark') applyDark(true);

  // ── INIT ──
  update();