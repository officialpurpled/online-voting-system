export function sideFlow(container) {
  const navToggle = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  let navOpen = false;
  
  const toggleNav = () => {
    if (!nav) return;
    navOpen = !navOpen;
    nav.style.display = navOpen ? 'block' : 'none';
    checkMargin()
  };
  
  navToggle?.addEventListener('click', toggleNav);
  
  function checkMargin() {
    const ExContEl = container;
    
    if (!ExContEl) return;
      if (navOpen) {
      ExContEl.style.paddingLeft = '192px';
    } else {
      ExContEl.style.paddingLeft = '7px';
    }
  }
  
  window.addEventListener("resize", checkMargin);
}