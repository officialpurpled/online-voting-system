import { API_KEY } from "../utils/library.js";
// import { toggleNav } from "../utils/navFlow.js";
import { showMsg } from "../utils/response.js";

const form = document.querySelector('#loginForm')
const loginBtn = document.querySelector('.loginBtn')
const passwordInput = document.querySelector('#password')
const message = document.querySelector('#feedback')
const passwordToggle = document.querySelector('.eye-icon i')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const matricNo = document.querySelector('.matric').value.trim().toUpperCase();
  const password = document.querySelector('.password').value.trim();
  const btnText = document.querySelector('.btn-text');
  const spinner = document.querySelector('.fa-spinner');
  const arrow = document.querySelector('.fa-sign-out-alt');

  showMsg('', '')
  loginBtn.disabled = true
  btnText.innerText = 'LOGGING IN'
  spinner.style.display = 'inline-block'
  arrow.style.display = 'none'

  if (!matricNo || !password) {
    showMsg('no', 'All field is required')
    loginBtn.disabled = false
    btnText.innerText = 'LOG IN'
    spinner.style.display = 'none'
    arrow.style.display = 'inline-block'
    return;
  }

  try {
    fetch(`${API_KEY}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matricNo, password })
    }).then(res => res.json())
      .then(data => {
        if (data.success === false) {
          loginBtn.disabled = false
          btnText.innerText = 'LOG IN'
          spinner.style.display = 'none'
          arrow.style.display = 'inline-block'
          showMsg('no', data.message)

          console.log('then false');

          return;
        }

        console.log('then true');
        showMsg('yes', `${data.message}. Redirecting...`);
        localStorage.setItem('p-id', JSON.stringify(data.token))

        setTimeout(() => {
          window.location.href = './dashboard.html'
          // console.log('Response: ', data.message)
        }, 1500);
      })
  } catch (error) {
    console.log('Error :', error.message)
    showMsg('no', error.message)
    loginBtn.disabled = false
    btnText.innerText = 'LOG IN'
    spinner.style.display = 'none'
    arrow.style.display = 'inline-block'
    return;
  }
})

passwordToggle.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password'

  passwordInput.type = isPassword ? 'text' : 'password'
  passwordToggle.classList.toggle('fa-eye-slash')

  console.log('clicked')
})

const toogleNav = () => {
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
toogleNav()
