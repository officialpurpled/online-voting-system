import { sideFlow} from "./utils/navFlow.js";
import { API_KEY, logout } from "./utils/library.js";

const token = JSON.parse(localStorage.getItem('p-id'))
  
if(!token || token === null){
  alert("Session Timeout \n Please login again.")
  window.location.href = './login.html'
}

let userId;

const department = document.querySelector('.campBody#department')
const faculty = document.querySelector('.campBody#faculty')
const general = document.querySelector('.campBody#general')
const tempBody = document.querySelectorAll('.tempBody')
const userInfo = document.querySelector('.uuname'); //header

async function miniProfile(elem) {
  // Display mini user info
  fetch(`${API_KEY}/user/profile`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  }).then(res=> res.json()).then(data => {
    elem.innerHTML = `
      <p>${data.username.slice(0, 1)}</p>
      <p>${data.studentId}</p>
    `
    userId = data._id
  })
  .catch(err => console.log(err))
}

//insert result card into its container right
const getTargetContainer = (election) => {
  if (election === 'department') return department;
  if (election === 'faculty') return faculty
  if (election === 'general' || 'sug') return general

  return null;
};

//build election card
const buildCard = (candidate, election) => `
  <div class="election-card" id="${election._id}">
    <div class="icon">
      <img src="../images/avatar.jpg" alt="">
    </div>
    <div class="details">
      <div class="position"> 
        <b>POST :</b> ${election.post.toUpperCase()}
      </div>
      <select name="candidate" id="candidates-${election._id}" class="candidate-select">
        <option value="" selected disabled>         
          Select a candidate
        </option>
        ${candidate.map(c => `
          <option value="${c.userId.username}">
            ${c.userId.username}
          </option>`).join('')}
      </select>
      <button class="vote" data-election-id="${election._id}"> 
        VOTE 
      </button>
    </div>
  </div>
`;

// Initial fetch of elections
function fetchElections() {
  fetch(`${API_KEY}/user/get-election`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const deptData = data.department
      const facData = data.faculty
      const sugData = data.sug

      if (deptData) {
        if (!deptData || deptData.length === 0) {
          tempBody[0].innerHTML = 'test 0 this'          
        }

        department.style.display = 'grid'
        tempBody[0].style.display = 'none'

        deptData.forEach(election => {
          const container = getTargetContainer('department');
          if (!container) return;
          // election.forEach(candidate => {
          container.insertAdjacentHTML('beforeend', buildCard(election.candidates, election));
          // });
        });
          // department.innerHTML += electionCard
      } 
      if (facData) {
        if (!facData || facData.length === 0) {
          tempBody[1].innerHTML = 'test 1 this'          
        }
        faculty.style.display = 'grid'
        tempBody[1].style.display = 'none'

        facData.forEach(election => {
          const container = getTargetContainer('department');
          if (!container) return;
          // election.forEach(candidate => {
          container.insertAdjacentHTML('beforeend', buildCard(election.candidates, election));
          // });
        });

        // faculty.innerHTML += electionCard
      }
      if (sugData) {
        if (!sugData || sugData.length === 0) {
          tempBody[2].innerHTML = 'test 2 this'          
        }
        general.style.display = 'grid'
        tempBody[2].style.display = 'none'

        sugData.forEach(election => {
          const container = getTargetContainer('department');
          if (!container) return;
          // election.forEach(candidate => {
          container.insertAdjacentHTML('beforeend', buildCard(election.candidates, election));
          // });
        });

        // general.innerHTML += electionCard
      }
  
      // Add vote button event listeners
      document.querySelectorAll('.vote').forEach(button => {
        button.addEventListener('click', handleVote);
      });
    })
    .catch(err => {
      alert("Network Error. \n Please check your internet connection and try again") 
      
      tempBody.forEach(body => body.innerHTML = '<p class="error-msg">Unable to load elections at the moment. Please refresh or check back.</p>');

      console.log('Error: Unable to display elections', err)
    })
}

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
    userId,
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

//on load
miniProfile(userInfo)
fetchElections();
sideFlow(document.querySelector('#dashbord'));

logout();