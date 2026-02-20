(() => {
  const navToggle = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  let navOpen = false;

  const toggleNav = () => {
    if (!nav) return;
    navOpen = !navOpen;
    nav.style.display = navOpen ? 'block' : 'none';
    checkMargin();
  };

  navToggle?.addEventListener('click', toggleNav, );

  function checkMargin() {
    const resultsEl = document.querySelector('#results');
    if (!resultsEl) return;
    const cardContainers = document.querySelectorAll('.card-container');

    if (navOpen) {
      resultsEl.style.marginLeft = '192px';
      const shouldStack = resultsEl.offsetWidth <= 450;
      cardContainers.forEach(card => {
        card.style.gridTemplateColumns = shouldStack ? '1fr' : '';
      });
    } else {
      resultsEl.style.marginLeft = '';
      cardContainers.forEach(card => {
        card.style.gridTemplateColumns = '';
      });
    }
  }
  checkMargin()

  window.addEventListener("resize", checkMargin);


  const sectionIds = ['dept-modal', 'faculty-modal', 'sug-modal'];
  
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  sections.forEach(section => {
    section.style.display = 'none';
    section.style.overflow = 'hidden';
    section.style.maxHeight = '0';
    section.style.opacity = '0';
    section.dataset.open = 'false';
  });

  const animateSection = (section, open) => {
    section.style.transition = 'max-height 0.45s ease, opacity 0.45s ease';
    if (open) {
      section.style.display = 'block';
      section.style.maxHeight = '0';
      section.style.opacity = '0';
      section.dataset.open = 'true';
      requestAnimationFrame(() => {
        section.style.maxHeight = `${section.scrollHeight}px`;
        section.style.opacity = '1';
      });
      return;
    }

    section.style.maxHeight = '0';
    section.style.opacity = '0';
    section.dataset.open = 'false';
    setTimeout(() => {
      if (section.dataset.open === 'false') {
        section.style.display = 'none';
      }
    }, 500);
  };

  document.querySelectorAll('.result').forEach((tab, index) => {
    const section = sections[index];
    if (!section) return;
    tab.addEventListener('click', () => {
      sections.forEach(sec => {
        animateSection(sec, sec === section);
      });
    });
  });
})();
