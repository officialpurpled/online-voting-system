lucide.createIcons()

export function sideFlow(container) {
  const navToggle = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  let navOpen = false;

  const toggleNav = () => {
    if (!nav) return;
    navOpen = !navOpen;

    nav.style.display = navOpen ? 'block' : 'none';
    navToggle.innerHTML = `<i 
      data-lucide=${navOpen ? "x" : "menu"}
    ></i>`;
    lucide.createIcons()
    // checkMargin()
  };

  navToggle?.addEventListener('click', toggleNav);

  //excluded
  function checkMargin() {
    const ExContEl = container;

    if (!ExContEl) return;
    if (navOpen) {
      ExContEl.style.paddingLeft = '192px';
      console.log(ExContEl)
    } else {
      ExContEl.style.paddingLeft = '7px';
    }
  }

  window.addEventListener("resize", checkMargin);
}

export function toggleNav() {
  let isOpen = false

  const navMenu = document.querySelector('.menu-list')
  const menuIcon = document.querySelector('.menu-icon')

  if (!navMenu || !menuIcon) return

  const openMenu = () => {
    navMenu.classList.add('open')
    menuIcon.innerHTML = `<i data-lucide="x"></i>`

    lucide.createIcons()
    isOpen = true
  }

  const closeMenu = () => {
    navMenu.classList.remove('open')
    menuIcon.innerHTML = `<i data-lucide="menu"></i>`

    lucide.createIcons()

    isOpen = false
  }

  menuIcon.addEventListener('click', (e) => {
    e.stopPropagation()
    isOpen ? closeMenu() : openMenu()
  })

  document.addEventListener('click', (e) => {
    if (isOpen && !navMenu.contains(e.target) && !menuIcon.contains(e.target)) {
      closeMenu()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      isOpen ? closeMenu() : openMenu()
    }
  })
}
