function toggleNav() {
  let isOpen = false

  const navMenu = document.querySelector('.menu-list')
  const hamburger = document.querySelector('.menu-icon')

  hamburger.addEventListener('click', () => {
    isOpen = !isOpen

    hamburger.innerHTML = isOpen ? `<i class="fas fa-times"></i>` : `<i class="fas fa-bars"></i>` //tenary operator

    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  })
}

export default toggleNav