import { API_KEY } from "../utils/library.js";
import { showMsg } from "../utils/response.js";

const resetBtn = document.querySelector('.reset')
const message = document.querySelector('#message')

resetBtn.addEventListener('click',()=>{
  let matric = document.querySelector('.matric').value.trim().toUpperCase();
  let email = document.querySelector('.email').value.trim();
  let password = document.querySelector('.password')
  let newPassword = password.value.trim();
  
  resetBtn.disabled = true
  resetBtn.innerText = 'RESETTING...'
  message.innerHTML = ''

  if(!matric || !newPassword || !email){
    showMsg('no', 'All field is required')
    resetBtn.disabled = false
    resetBtn.innerText = 'RESET'
    return;
  }

  if(newPassword.length < 6) {
    resetBtn.disabled = false
    resetBtn.innerText = 'RESET'
    showMsg('no', 'Password should be atleast 6')
    return 
  }

  fetch(`${API_KEY}/auth/forget-password`, {
    method: 'PUT',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({matric, email,  newPassword})
  })
  .then(res => res.json())
  .then(data => { 
    if (data.success === false) {
      resetBtn.disabled = false
      resetBtn.innerText = 'RESET'
      showMsg('no', data.message)
      return;
    }
    
    showMsg('yes', `${data.message}`);

    setTimeout(() => {
      window.location.href = './login.html'
    }, 1500);
    // console.log('Response: ', data.message)
  })
  .catch((err) => {
    showMsg('no', "Network Error. Please check your connection and try again.")
    // message.innerHTML = 
    resetBtn.disabled = false
    resetBtn.innerText = 'RESET';
    password.value=''
    console.log('Error:', err)})
});
