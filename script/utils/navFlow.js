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
  const hamburger = document.querySelector('.menu-icon')

  if (!navMenu || !hamburger) return

  hamburger.parentElement.addEventListener('click', (event) => {
    const menuIcon = event.target.closest('.menu-icon')
    if (!menuIcon) return

    isOpen = !isOpen

    navMenu.classList.toggle('open', isOpen)
    menuIcon.outerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}" class="menu-icon${isOpen ? ' active' : ''}"></i>`
    lucide.createIcons()
  })
}
