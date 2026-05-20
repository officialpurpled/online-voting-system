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
      data-lucide=${navOpen? "x":"menu"}
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