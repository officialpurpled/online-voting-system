import { API_KEY } from "../utils/library.js";
import { toggleNav } from "../utils/navFlow.js";
import { showMsg } from "../utils/response.js";

lucide.createIcons()

const form = document.querySelector('#loginForm')
const loginBtn = document.querySelector('.loginBtn')
const passwordInput = document.querySelector('#password')
const message = document.querySelector('#feedback')
const passwordToggle = document.querySelector('.password-toggle')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const matricNo = document.querySelector('.matric').value.trim().toUpperCase();
  const password = document.querySelector('.password').value.trim();
  const btnText = document.querySelector('.btn-text');
  const spinner = document.querySelector('.fa-spinner');
  const arrow = document.querySelector('.login-arrow');

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
  passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password')
  passwordToggle.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" aria-hidden="true"></i>`
  lucide.createIcons()
})

toggleNav()
