const fields = [
  { id: 'name', target: 'cv-name' },
  { id: 'title', target: 'cv-title' },
  { id: 'title-translation', target: 'cv-title-translation' },
  { id: 'personal', target: 'cv-personal' },
  { id: 'summary', target: 'cv-summary' },
  { id: 'education', target: 'cv-education' },
  { id: 'diplomas', target: 'cv-diplomas' },
  { id: 'experience', target: 'cv-experience' },
  { id: 'skills', target: 'cv-skills' },
  { id: 'contact', target: 'cv-contact' },
];

function isArabicText(value) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(value);
}

function getDirectionFromText() {
  const inputs = ['name', 'title', 'summary', 'personal', 'experience', 'education', 'diplomas', 'skills', 'contact'];
  let hasArabic = false;
  let hasLatin = false;

  inputs.forEach((id) => {
    const value = document.getElementById(id)?.value || '';
    if (isArabicText(value)) {
      hasArabic = true;
    }
    if (/[A-Za-z]/.test(value)) {
      hasLatin = true;
    }
  });

  if (hasArabic && !hasLatin) {
    return 'rtl';
  }
  if (hasLatin && !hasArabic) {
    return 'ltr';
  }
  return 'rtl';
}

function updatePreview() {
  fields.forEach(({ id, target }) => {
    const input = document.getElementById(id);
    const preview = document.getElementById(target);
    const value = input.value.trim();
    preview.textContent = value;

    const section = preview.closest('.cv-section');
    if (section) {
      section.style.display = value ? '' : 'none';
    }

    preview.style.display = value ? '' : 'none';
  });

  const preview = document.getElementById('cv-preview');
  const direction = getDirectionFromText();
  preview.dir = direction;
  preview.classList.remove('lang-ltr', 'lang-rtl');
  preview.classList.add(`lang-${direction}`);
}

function handlePhotoUpload() {
  const photoInput = document.getElementById('photo');
  const photoPreview = document.getElementById('cv-photo');
  const photoBox = document.getElementById('cv-image');
  const photoStatus = document.getElementById('photo-status');
  const file = photoInput.files[0];

  if (file && file.type.startsWith('image/')) {
    const imageUrl = URL.createObjectURL(file);
    photoPreview.src = imageUrl;
    photoBox.classList.add('has-photo');
    
    photoStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i> Photo ajoutée avec succès / تم إضافة الصورة بنجاح';
    photoStatus.classList.add('show');
  } else {
    photoPreview.src = '';
    photoBox.classList.remove('has-photo');
    
    photoStatus.innerHTML = '';
    photoStatus.classList.remove('show');
  }
}

function initForm() {
  fields.forEach(({ id }) => {
    const input = document.getElementById(id);
    input.addEventListener('input', updatePreview);
  });

  document.getElementById('photo').addEventListener('change', handlePhotoUpload);
  document.getElementById('photo-btn').addEventListener('click', () => {
    document.getElementById('photo').click();
  });
  document.getElementById('print-btn').addEventListener('click', () => {
    updatePreview();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile && typeof html2pdf !== 'undefined') {
      const printBtn = document.getElementById('print-btn');
      const originalText = printBtn.innerHTML;
      printBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';

      // Capture original state
      const originalPreview = document.getElementById('cv-preview');
      const cvDir = originalPreview.dir || 'rtl';
      
      // Create isolated iframe specifically sized to Desktop A4
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.width = '794px';
      iframe.style.height = '1122px';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      
      // Inject the CV inside a perfectly constrained A4 div
      doc.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="${cvDir}">
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <link rel="stylesheet" href="${window.location.origin}/styles.css">
          <style>
            body { background: #ffffff; padding: 0; margin: 0; }
            /* Exact PC Print Replicas */
            .cv-preview {
              border: 1px solid #102a43 !important;
              box-shadow: none !important;
              background: #ffffff !important;
              margin: 0 auto !important;
              border-radius: 0 !important;
            }
            .cv-preview::before, .cv-preview > h2 { display: none !important; }
            .cv-top {
              border-bottom: 1px solid rgba(16, 42, 67, 0.16) !important;
              background: transparent !important;
              justify-content: center !important;
              border-radius: 0 !important;
              padding-bottom: 12px !important;
            }
            .cv-section { background: transparent !important; border: none !important; margin-top: 12px !important; padding: 12px !important; }
            .cv-section h3 { background: rgba(16, 42, 67, 0.08) !important; padding: 3px 6px !important; border-radius: 6px !important; color: #102a43 !important; display: inline-block !important; margin-bottom: 8px !important; }
            .cv-section h3::before { display: none !important; }
            .cv-section p { background: transparent !important; border: none !important; padding: 0 !important; color: #102a43 !important; font-size: 10pt !important; line-height: 1.4 !important; }
            p, h1, h2, h3, span { color: #102a43 !important; }
            .cv-image { border: 1px solid rgba(16, 42, 67, 0.16) !important; background: transparent !important; box-shadow: none !important; width: 130px !important; height: 130px !important; border-radius: 16px !important; }
            .cv-header { border-bottom: none !important; padding-bottom: 0 !important; text-align: center !important; }
            .cv-header h1 { font-size: 1.8rem !important; }
            
            /* Language hiding for translations */
            .cv-preview.lang-ltr .heading-arabic, .cv-preview.lang-ltr .label-arabic { display: none !important; }
            .cv-preview.lang-rtl .heading-translation, .cv-preview.lang-rtl .label-translation { display: none !important; }
          </style>
        </head>
        <body>
          <div id="pdf-wrapper" style="width: 210mm; min-height: 297mm; padding: 10mm; box-sizing: border-box; margin: 0 auto; background: white; direction: ${cvDir};">
             ${originalPreview.outerHTML}
          </div>
        </body>
        </html>
      `);
      doc.close();

      // Wait 1.5 seconds for CSS & Fonts to fully load in the iframe before capturing
      setTimeout(() => {
        const targetElement = doc.getElementById('pdf-wrapper');
        const widthPx = targetElement.offsetWidth || 794;
        const heightPx = targetElement.offsetHeight;
        
        // Calculate proportional height in millimeters based on standard A4 width (210mm)
        const ratio = 210 / widthPx;
        const heightMm = Math.max(297, heightPx * ratio);

        const opt = {
          margin:       0,
          filename:     'Souhoula_CV.pdf',
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            scrollY: 0,
            x: 0,
            y: 0,
            windowWidth: 794
          },
          jsPDF:        { unit: 'mm', format: [210, heightMm], orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(targetElement).save().then(() => {
          printBtn.innerHTML = originalText;
          document.body.removeChild(iframe);
        }).catch(err => {
          console.error(err);
          printBtn.innerHTML = originalText;
          document.body.removeChild(iframe);
        });
      }, 1500);
    } else {
      window.print();
    }
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateDarkModeButton();
  }

  updatePreview();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Save theme preference
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  
  updateDarkModeButton();
}

function updateDarkModeButton() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  if (isDarkMode) {
    darkModeToggle.textContent = '☀️ الوضع الفاتح';
    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    darkModeToggle.textContent = '🌙 الوضع المظلم';
    darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

document.addEventListener('DOMContentLoaded', initForm);
