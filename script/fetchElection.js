import { sideFlow} from "./utils/navFlow.js";
import { API_KEY, logout } from "./utils/library.js";

lucide.createIcons();

const token = JSON.parse(localStorage.getItem('p-id'))
  
if(!token || token === null){
  alert("User not logged in. kindly login again")
  window.location.href = './login.html'
}

const department = document.querySelector('.campBody#department')
const faculty = document.querySelector('.campBody#faculty')
const general = document.querySelector('.campBody#general')
const tempBody = document.querySelectorAll('.tempBody')

console.log(department, general, faculty); // Debugging line to check API_KEY value

export function miniProfile(userInfo) {
  // Display mini user info
  userInfo.innerHTML = `<div class=""> fetching data... </div>`

  try {
    fetch(`${API_KEY}/user/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }
    // const res = await fetch(`../data/users.json`
    )
    .then(res => res.json()) 
    .then(data => {
      if (data.redirect === true) {
        alert(data.message)
        window.location.href = "./login.html"
        return
      }
  
      if (data.success === false) {
        alert(data.message)
        return
      }
      
      const user = data.user
  
      userInfo.innerHTML = `
        <div class="avatar"> 
          <img src="${user.passport.url}" >
        </div>
  
        <div style="display: flex; flex-direction: column;" id="ab-user-info">
          <p>${user.username}</p>
          <p>${user.studentId}</p>
        </div>
      `;

      return user;
    })
  } catch (err) {
    userInfo.innerHTML = `<div> Error fetching profile</div>`
    console.error(err);
    return null;
  }
}

//insert result card into its container right
const getTargetContainer = (election) => {
  if (election === 'department') return department;
  if (election === 'faculty') return faculty
  if (election === 'general') return general

  return null;
};

//build election card
const buildCard = (candidate, election) => `
  <div class="election-card" id="${election._id}">
    <div class="icon">
      <img src="../images/ballot.jpg" alt="">
    </div>
    <div class="details">
      <div class="position"> 
        <b>POST :</b> ${election.post}
      </div>
      <select name="candidate" id="candidates-${election._id}" class="candidate-select">
        <option value="" selected disabled>         
          Select a candidate
        </option>
        ${candidate.map(c => `
          <option value="${c._id}">
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
  tempBody.forEach(body => {
   body.innerHTML = '<div>fetching election data...</div>'
  }) 

  fetch(`${API_KEY}/user/get-election`, {
    method: 'GET',
    headers: {
      Authorization : `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success === false && data.redirect === true) {
        alert(data.message)
        window.location.href = "./login.html"
        return
      }

      if (data.success === false) {
        tempBody.forEach(body => body.innerHTML = `<p class="error-msg">${data.message}</p>`);
        // alert(data.message)
        return
      }

      const deptData = data.department
      const facData = data.faculty
      const sugData = data.sug

      if (deptData) {
        if (!deptData || deptData.length === 0) {
          tempBody[0].innerHTML = 'No Available ELection'          
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
          tempBody[1].innerHTML = 'No Available ELection'          
        }
        faculty.style.display = 'grid'
        tempBody[1].style.display = 'none'

        facData.forEach(election => {
          const container = getTargetContainer('faculty');
          if (!container) return;
          // election.forEach(candidate => {
          container.insertAdjacentHTML('beforeend', buildCard(election.candidates, election));
          // });
        });

        // faculty.innerHTML += electionCard
      }
      if (sugData) {
        if (!sugData || sugData.length === 0) {
          tempBody[2].innerHTML = 'No Available ELection'          
        }
        general.style.display = 'grid'
        tempBody[2].style.display = 'none'

        sugData.forEach(election => {
          const container = getTargetContainer('general');
          if (!container) return;
          // election.forEach(candidate => {
          container.insertAdjacentHTML('beforeend', buildCard(election.candidates, election));
          // });
        });

        // general.innerHTML += electionCard
      }
  
      // Add vote event listeners
      document.querySelectorAll('.vote').forEach(button => {
        button.addEventListener('click',  handleVote);
      });
    })
    .catch(err => {
      alert("Network Error. Please check your internet connection and try again") 
      
      tempBody.forEach(body => body.innerHTML = '<p class="error-msg">Unable to load elections at the moment. Please refresh or check back.</p>');

      console.log('Error: Unable to display elections', err)
    })
}

// Handle vote submission
function handleVote(event) {
  event.target.disabled = true;
  event.target.textContent = 'VOTING..';

  const electionId = event.target.getAttribute('data-election-id');
  const candidateSelect = document.querySelector(`#candidates-${electionId}`);
  const candidateId = candidateSelect.value;

  if (!candidateId) {
    alert('Please select a candidate before voting');
    return;
  }

  if (!token || token === undefined) {
    alert('User not logged in');
    window.location.href = './login.html';
    return;
  }

  const voteData = {
    electionId: electionId,
    candidateId: candidateId
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
    if (data.success === false && data.redirect === true) {
      event.target.textContent = 'VOTE';
      alert(data.message)
      window.location.href = "./login.html"
      return
    }

    if (data.success === false && data.message.includes('voted')) {
      alert(data.message)
      event.target.disabled = true;
      event.target.textContent = 'VOTED';
      return
    }

    if (data.success === false) {
      alert(data.message)
      event.target.disabled = false;
      event.target.textContent = 'VOTE';
      return
    }

    // if (data.status === 200 || data.message.includes('successfully')) {
    alert('Vote submitted successfully!');
    event.target.disabled = true;
    event.target.textContent = 'VOTED';
    // } 
  })
  .catch(err => {
    event.target.disabled = false;
    event.target.textContent = 'VOTE';
    alert(`Error submitting vote ${err.message}`);
    console.error('Vote submission error:', err);
  });
}

//on load
miniProfile(document.querySelector('.profile-abstract'))
fetchElections()

sideFlow(document.querySelector('main'));

logout();