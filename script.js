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
    const cvPreview = document.getElementById('cv-preview');
    
    // Create a temporary hidden clone strictly dimensioned as the A4 print canvas 
    // to measure how tall the content actually renders.
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.width = '190mm'; // The exact max-width from @media print CSS
    measureDiv.style.padding = '10mm';
    measureDiv.style.boxSizing = 'border-box';
    measureDiv.style.left = '-9999px';
    
    const clone = cvPreview.cloneNode(true);
    // Strip display properties that might distort measurement
    clone.style.width = '100%'; 
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    
    measureDiv.appendChild(clone);
    document.body.appendChild(measureDiv);
    
    const actualHeight = clone.scrollHeight;
    let scale = 1;
    // Roughly 1050px is the safe maximum height of an A4 print sheet minus margins at 96dpi.
    const maxHeight = 1050;
    
    if (actualHeight > maxHeight) {
        // Dynamically shrink it purely for fitting it onto a single sheet of paper
        scale = maxHeight / actualHeight;
    }
    
    document.body.removeChild(measureDiv);
    
    // Apply the scaling temporarily immediately before popping the print dialog
    cvPreview.style.zoom = scale;
    if (scale < 1) {
        // Fallback for browsers that ignore CSS zoom (Firefox etc)
        cvPreview.style.transform = `scale(${scale})`;
        cvPreview.style.transformOrigin = 'top center';
    }
    
    // Allow the browser render thread to apply the zoom before triggering the dialog
    setTimeout(() => {
      window.print();
      
      // Immediately un-zoom after the print dialog resolves to restore on-screen layout
      setTimeout(() => {
          cvPreview.style.zoom = '1';
          cvPreview.style.transform = 'none';
      }, 500);
    }, 100);
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
