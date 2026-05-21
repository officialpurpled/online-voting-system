import { API_KEY } from "../utils/library.js";
import { showMsg } from "../utils/response.js";

const loginBtn = document.querySelector('.login')
const message = document.querySelector('#message')

loginBtn.addEventListener('click',()=>{
  let matricNo = document.querySelector('.matric').value.trim().toUpperCase();
  let password = document.querySelector('.password').value.trim();
  
  loginBtn.disabled = true
  loginBtn.innerText = 'LOGGING IN...'
  message.innerHTML = ''

  if(!matricNo || !password){
    showMsg('no', 'All field is required')
    loginBtn.disabled = false
    loginBtn.innerText = 'LOG IN'
    return;
  }

  fetch(`${API_KEY}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({matricNo, password})
  })
  .then(res => res.json())
  .then(data => { 
    if (data.success === false) {
      loginBtn.disabled = false
      loginBtn.innerText = 'LOG IN'
      showMsg('no', data.message)
      return;
    }
    
    showMsg('yes', `${data.message}. Redirecting...`);
    localStorage.setItem('p-id', JSON.stringify(data.token))

    setTimeout(() => {
      window.location.href = './dashboard.html'
    }, 1500);
    // console.log('Response: ', data.message)
  })
  .catch((err) => {
    showMsg('no', "Network Error. Please check your connection and try again.")
    // message.innerHTML = 
    loginBtn.disabled = false
    loginBtn.innerText = 'LOG IN';
    console.log('Error:', err)})
});
