import { API_KEY } from "../utils/library.js";
import { showMsg } from "../utils/response.js";

const loginBtn = document.querySelector('.login')
const message = document.querySelector('#message')

loginBtn.addEventListener('click',()=>{
  let matricNo = document.querySelector('.matric').value.trim().toUpperCase();
  let password = document.querySelector('.password').value.trim();
  
  loginBtn.disabled = true
  loginBtn.innerHTML = 'LOGGING IN...'
  message.innerText = ''

  if(!matricNo || !password){
    showMsg('no', 'empty')
    loginBtn.disabled = false
    loginBtn.innerHTML = 'LOG IN'
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
    if (!data.success) {
      loginBtn.disabled = false
      loginBtn.innerHTML = 'LOG IN'
      message.innerHTML = data.message
      return;
    }
    
    message.innerText = `${data.message}. ${showMsg('yes', 'Login')}`;
    localStorage.setItem('p-id', JSON.stringify(data.token))

    setTimeout(() => {
      window.location.href = './dashboard.html'
    }, 1500);
    // console.log('Response: ', data.message)
  })
  .catch((err) => {
    message.innerHTML = "Network Error. Please check your connection and try again."
    loginBtn.disabled = false
    loginBtn.innerHTML = 'LOG IN';
    console.log('Error:', err)})
});
