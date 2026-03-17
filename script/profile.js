import { API_KEY, logout } from "./utils/library.js";

const token = JSON.parse(localStorage.getItem('p-id'))
  
if(!token || token === null){
  alert("Unauthorized Access \n Please login.")
  window.location.href = './login.html'
}

let user;

const userinfor = document.querySelector('.userinfor');

// Fetch the vote count from the server
async function getUserVote(iD) {
  const res = await fetch(`${API_KEY}/user/get-votes/${iD}`);
  const data = await res.json();
  return data.voteCount; // return the number directly
}

// Update the profile page with user data
function updateProfile() {
  fetch(`${API_KEY}/user/profile`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(async data => {
    user = data;

    userinfor.innerHTML = `
      <div class="biodata">
        <span class="label">BIO DATA</span>
        <div>
          Name: <p>${user.username}</p>
        </div>
        <div>
          Email: <p>${user.email}</p>
        </div>
        <div>
          Reg/Matric: <p>${user.matric}</p>
        </div>
        <div>
          User ID:<p>${user.studentId}</p>
        </div>
        <div>
          Vote count:<p>${await getUserVote(user._id)}</p>
        </div>
      </div>
    
      <div class="stddata">
        <span class="label">STUDENTSHIP DATA</span>
        <div>
          Faculty: <p>${user.faculty}</p>
        </div>
        <div>
          Department: <p>${user.department}</p>
        </div>
        <div>
          Current Level: <p>${user.level}</p>
        </div>
    
        <button> 
          <a href="dashboard.html">
            Back to dashboard 
          </a>
        </button>
      </div>
    `;
})
  .catch(err => console.log(err))
}

updateProfile();
logout();


// {


// let userinfor= document.querySelector('.userinfor');

// let userimg= document.querySelector('.userimg img');

// // const userId = currentUser.userId

// // users.forEach(user => {
// //   if (user.userId == currentUser.userId) {
// //     user.session.lastLogin = currentUser.session.lastLogin

// //     saveToStorage(users);
// //   }
// // });
// const token = JSON.parse(localStorage.getItem('p-id'))
// let user;
// if(!token || token === null){
//   alert("Unauthorized Access \n Please login.")
//   window.location.href = './login.html'
// }


// function renderProfileData() {
//   userimg.src = currentUser.image.photo || "../images/avatar.jpg";
//   userinfor.innerHTML = `
//     <div class="biodata">
//       <span class="label">BIO DATA</span>
//       <div>
//         Name: <p> ${currentUser.username}</p>
//       </div>
//       <div>
//         Email: <p> ${currentUser.email}</p>
//       </div>
//       <div>
//         Reg/Matric: <p> ${currentUser.matric}</p>
//       </div>
//       <div>
//         User ID:<p>  ${currentUser.userId}</p>
//       </div>
//       <div>
//         Vote count:<p>  ${currentUser.vote}</p>
//       </div>
//     </div>
//     <div class="stddata">
//       <span class="label">STUDENTSHIP DATA</span>
//       <div>
//         Faculty: <p>${currentUser.faculty}</p>
//       </div>
//       <div>
//         Department: <p>${currentUser.department}</p>
//       </div>
//       <div>
//         Current Level: <p> ${currentUser.level}</p>
//       </div>

//       <button> 
//         <a href="dashboard.html">
//           Back to dashboard 
//         </a>
//       </button>
//     </div>
//   `
// }

// sideFlow(document.querySelector('#profile'))
// renderProfileData()
// console.log(currentUser);
// }

// import {logOut, API_KEY } from "../data/user.js";
