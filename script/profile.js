import { getFromStorage } from "../data/users.js";

let userinfor= document.querySelector('.userinfor');

let userimg= document.querySelector('.userimg img');

const currentUser = getFromStorage('currentUser');

const users = getFromStorage('users');

// const userId = currentUser.userId

// users.forEach(user => {
//   if (user.userId == currentUser.userId) {
//     user.session.lastLogin = currentUser.session.lastLogin

//     saveToStorage(users);
//   }
// });

function renderProfileData() {
  userimg.src = currentUser.image.photo || "../images/avatar.jpg";
  userinfor.innerHTML = `
    <div class="biodata">
      <span class="label">BIO DATA</span>
      <div>
        Name: <p> ${currentUser.username}</p>
      </div>
      <div>
        Email: <p> ${currentUser.email}</p>
      </div>
      <div>
        Reg/Matric: <p> ${currentUser.matric}</p>
      </div>
      <div>
        User ID:<p>  ${currentUser.userId}</p>
      </div>
      <div>
        Vote count:<p>  ${currentUser.vote}</p>
      </div>
    </div>
    <div class="stddata">
      <span class="label">STUDENTSHIP DATA</span>
      <div>
        Faculty: <p>${currentUser.faculty}</p>
      </div>
      <div>
        Department: <p>${currentUser.department}</p>
      </div>
      <div>
        Current Level: <p> ${currentUser.level}</p>
      </div>

      <button> 
        <a href="dashboard.html">
          Back to dashboard 
        </a>
      </button>
    </div>
  `
}
renderProfileData()
console.log(currentUser);