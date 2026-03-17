import { sideFlow} from "./utils/navFlow.js";
import { API_KEY, logout } from "./utils/library.js";

const token = JSON.parse(localStorage.getItem('p-id'))
  
if(!token || token === null){
  alert("Unauthorized Access \n Please login.")
  window.location.href = './login.html'
}

let user;

const department = document.querySelector('.campBody#department')
const faculty = document.querySelector('.campBody#faculty')
const general = document.querySelector('.campBody#general')
const tempBody = document.querySelectorAll('.tempBody')
const userInfo = document.querySelector('.uuname');

function miniProfile(elem) {
  // Display mini user info
  fetch(`${API_KEY}/user/profile`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  }).then(res=> res.json()).then(data => {
    elem.innerHTML = `
      <p>${data.username}</p>
      <p>${data.studentId}</p>
    `
    user = data
  })
  .catch(err => console.log(err))
}

function fetchElections() {
  fetch(`${API_KEY}/user/get-election`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      data.forEach(election => {
        let electionCard = `
          <div class="election-card" id="${election._id}">
            <div class="icon">
              <img src="../images/avatar.jpg" alt="">
            </div>
            <div class="details">
              <div class="position"> 
                <b>POST :</b> ${election.post}
              </div>
              <select name="candidate" id="candidates-${election._id}" class="candidate-select">
                <option value="" selected disabled>         
                  Select a candidate
                </option>
                ${election.candidates.map(candidate => `<option value="${candidate.name}">${candidate.name}</option>`).join('')}
              </select>
              <button class="vote" data-election-id="${election._id}"> 
                VOTE 
              </button>
            </div>
          </div>`
        if (election.mode === 'department') {
          department.style.display = 'grid'
          tempBody[0].style.display = 'none'
          department.innerHTML += electionCard
          
        } else if (election.mode === 'faculty') {
          faculty.style.display = 'grid'
          tempBody[1].style.display = 'none'
          faculty.innerHTML += electionCard
          
        } else if (election.mode === 'general') {
          general.style.display = 'grid'
          tempBody[2].style.display = 'none'
          general.innerHTML += electionCard
        }
      });
  
      // Add vote button event listeners
      document.querySelectorAll('.vote').forEach(button => {
        button.addEventListener('click', handleVote);
      });
    })
    .catch(err => {
      tempBody.forEach(body => body.innerHTML = '<p class="error-msg">Unable to load elections at the moment. Please refresh or checkback.</p>');
      console.log('Error: Unable to display elections', err)
    })
}
// Initial fetch of elections


// Handle vote submission
function handleVote(event) {
  const electionId = event.target.getAttribute('data-election-id');
  const candidateSelect = document.querySelector(`#candidates-${electionId}`);
  const candidateName = candidateSelect.value;

  if (!candidateName) {
    alert('Please select a candidate before voting');
    return;
  }


  if (
    // !user._id
    !token
  ) {
    alert('User not logged in');
    return;
  }

  const voteData = {
    userId: user._id,
    electionId: electionId,
    candidateName: candidateName
  };

  fetch(`${API_KEY}/user/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(voteData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 200 || data.message.includes('successfully')) {
      alert('Vote submitted successfully!');
      event.target.disabled = true;
      event.target.textContent = 'VOTED';
    } else {
      alert(data.message || 'Error submitting vote');
    }
  })
  .catch(err => {
    alert('Error submitting vote');
    console.error('Vote submission error:', err);
  });
}

sideFlow(document.querySelector('#dashbord'));
fetchElections();
miniProfile(userInfo);
logout();



// import { getFromStorage, saveTempUser, saveToStorage } from "../data/users.js";
// {

// //Wasted

//   const currentUser = getFromStorage('currentUser');

//   if(!currentUser){
//     // alert('User Not Logged In')
//     // window.location.href = 'login.html'
//   }

//   const users = getFromStorage('users');

//   console.log(currentUser)

//   const userId = currentUser.userId
//   const userVote = currentUser.status.voted;

//   let isVote = userVote

//   const voteBtn = document.querySelector('.vote')

//   document.querySelector('button').addEventListener('click', ()=>{
//     if (!isVote){
//       voteBtn.innerText = 'VOTED'
//       currentUser.status.voted = true
//       isVote = true

//       saveTempUser(currentUser)

//       alert('voted success');

//       users.forEach(user => {
//         if (user.userId == userId) {
//           user.status.voted = currentUser.status.voted
          
//           saveToStorage(users);
//           console.log('vote updated')            
//         }
//       });

//     } else {
//       alert('You already voted')
//       console.log(userVote)
//     }
//   })

// //Wasted
// function abstractProfileData() {
//   const img = currentUser.image.photo || "../images/avatar.jpg";
//   document.querySelector('.profile-abstract').innerHTML = `
//     <div class="avatar"> 
//       <img src=${img}>
//     </div>

//     <div class="uuname">
//       <p>${currentUser.username}</p>
//       <p>${currentUser.userId}</p>
//     </div>
//   `
// }
// abstractProfileData();


// function contrlFlow() {
//   const navToggle = document.querySelector('.menu-icon');
//   const nav = document.querySelector('nav');
//   let navOpen = false;
  
//   const toggleNav = () => {
//     if (!nav) return;
//     navOpen = !navOpen;
//     nav.style.display = navOpen ? 'block' : 'none';
//     checkMargin()
//   };
  
//   navToggle?.addEventListener('click', toggleNav);
  
//   function checkMargin() {
//     const ExDashboardEl = document.querySelector('#dashboard');
    
//     if (!ExDashboardEl) return;
//       if (navOpen) {
//       ExDashboardEl.style.paddingLeft = '192px';
//     } else {
//       ExDashboardEl.style.paddingLeft = '7px';
//     }
//   }
  
//   window.addEventListener("resize", checkMargin);
// }
// contrlFlow()
// }
