import toggleNav from "../script.js";
import { API_KEY } from "../utils/library.js";
import { showMsg } from "../utils/response.js";

const form = document.querySelector('#loginForm')
const loginBtn = document.querySelector('.loginBtn')
const passwordInput = document.querySelector('#password')
const message = document.querySelector('#feedback')
const passwordToggle = document.querySelector('.eye-icon i')

toggleNav()

// function validateInput(input) {
//   // 1. Remove all spaces and convert to uppercase for consistency
//   const cleanRegNo = input.replace(/\s+/g, '').toUpperCase();

//   // 2. Test against the regex pattern
//   const jambRegex = /^\d{10}[A-Z]{2}$/;
//   const oouFtRegex = /^[A-Z]{3,}\/\d{2}\/\d{2}\/\d{4}$/;

//   if (jambRegex.test(cleanRegNo) || oouFtRegex.test(cleanRegNo)) {
//     return { isValid: true, formatted: cleanRegNo };
//   } else {
//     return { isValid: false, formatted: input };
//   }
// }

// const regex = /^[a-z]{3,}\/\d{2}\/\d{2}\/\d{4}$/i; const validation = validateInput(matricNo);

// if (validation.isValid) {
//   console.log(`Valid JAMB Number! Saved as: ${validation.formatted}`);
// } else {
//   console.log("Invalid JAMB Registration Number format. Please check it and try again.");
// }


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
  }
})

passwordToggle.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password'

  passwordInput.type = isPassword ? 'text' : 'password'
  passwordToggle.classList.toggle('fa-eye-slash')

  console.log('clicked')
})