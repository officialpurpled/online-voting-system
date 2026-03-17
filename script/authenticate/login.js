import { API_KEY } from "../utils/library.js";

const loginBtn = document.querySelector('.login')
const message = document.querySelector('#message')

loginBtn.addEventListener('click',()=>{
  let matricNo = document.querySelector('.matric').value.trim();
  let password = document.querySelector('.password').value.trim();

  fetch(`${API_KEY}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({matricNo, password})
  })
  .then(res => res.json())
  .then(data => { 
    if (data.status === 500) {
      alert('user not found')
      return;
    }
    
    if (data.status === 404) {
      console.log('Response: ', data.message);
      message.innerText = data.message
      
    } else if (data.status == 400){
      message.innerText = data.message;
      console.log('Response: ', data.message)

    } else if (data.status === 200){
      message.innerText = data.message;

      localStorage.setItem('p-id', JSON.stringify(data.token))
      // saveToStorage(data.token) 
      console.log(data.token)

      setTimeout(() => {
        window.location.href = './dashboard.html'
      }, 2000);
      
      console.log('Response: ', data.message)
    }

  })
  .catch(err => console.log('Error:', err))
});



// {
// import {showMsg} from '../utils/message.js'
// // import {dayjs} from 'https://unpkg.com/dayjs@1.11.19/dayjs.min.js'


// const today = 'sept 5'
// // dayjs().format('ddd M, MMM YYYY (hh:mm A)');

// const loginBtn = document.querySelector('.login')

// function login(){
//   let regNo = document.querySelector('.matric').value.trim().toUpperCase();
//   let pascode = document.querySelector('.password').value.trim();

//   if(!regNo || !pascode){
//     showMsg('no', 'empty')
//     // alert('all fields are required')
//     console.log('all fields are required');
//     return;
//   }

//   let matched = false;
//   let currentUser;

//   users.forEach((user) => {
//     if (regNo === user.matric && pascode=== user.password){
//       matched = true;
//       currentUser = user;
//     }  
//   });
  
//   if (matched){
//     currentUser.session.lastLogin = today;

//     saveTempUser(currentUser);

//     showMsg('yes', 'Login')
//     console.log('matched success')

//     loginBtn.innerHTML = 'LOGGING IN...'
//     setTimeout(()=>{
//       window.location.href = '../pages/profile.html';
//     }, 2500)
//   } else {
//     loginBtn.innerHTML = 'LOGGING IN...'
//     setTimeout(()=>{
//       loginBtn.innerHTML = 'LOG IN'
//       showMsg('no', 'notfound')
//       // alert('User not found')
//     }, 1500)
//     console.log('User Not Found')
//   }
// }

// loginBtn.addEventListener('click',()=>{
//   let matricNo = document.querySelector('.matric').value.trim();
//   let password = document.querySelector('.password').value.trim();

//   fetch('http://localhost:3030/api/auth/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type' : 'application/json'
//     },
//     body: JSON.stringify({matricNo, password})
//   })
//   .then(res => res.json())
//   .then(data => console.log('Response: ', data.message))
//   .catch(err => console.log('Error:', err))

// login()
// });
// }
