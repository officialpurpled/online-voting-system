import { API_KEY, logout } from "./utils/library.js";
import { sideFlow } from "./utils/navFlow.js";

const token = JSON.parse(localStorage.getItem('p-id'))
  
if(!token || token === undefined){
  alert("User not logged in \n Please login.")
  window.location.href = './login.html'
}

const userinfor = document.querySelector('.userinfor');
const userimg = document.querySelector('.userimg img');

function renderProfile(user) {
  userimg.src = user.passport.url || '../images/avatar.jpg'
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
        Vote count:<p>${user.votedElections}</p>
      </div>
    </div>

    <div class="stddata">
      <div class="mdata">
        <span class="label">STUDENTSHIP DATA</span>
        <div>
          Faculty:<p>${user.faculty}</p>
        </div>
        <div>
          Department:<p>${user.department}</p>
        </div>
        <div>
          Current Level:<p>${user.level}</p>
        </div>
      </div>
      <div class="buttons">
        <button class="backBtn" href="./dashboard.html"> 
          Back to dashboard 
        </button>

        <button class="editBtn" onclick="showToast('Not awailable yet')">
          Edit Profile
        </button>
      </div>

    </div>
  `;
}

// Update the profile page with user data
function loadData() {
  userinfor.innerHTML = `<div class="biodata"> Loading Data... </div>`

  fetch(`${API_KEY}/user/profile`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if(data.message.includes('expired')){
      alert('Session timeout. Kindly login again')
      window.location.href = './login.html'
      return
    }

    renderProfile(data.user)
  })
  .catch(err => {
    userinfor.innerHTML = `<div class="biodata"> Error fetching profile data... </div>`
    console.log(err.message)
    return
  }
  )
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  await sideFlow(document.querySelector('#profile'))
})

logout();
