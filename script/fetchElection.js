import { toggleNav } from "./utils/navFlow.js";
import { API_KEY, logout, showToast } from "./utils/library.js";

lucide.createIcons();

const token = JSON.parse(localStorage.getItem('p-id'))

if (!token || token === null) {
  alert("User not logged in. kindly login again")
  window.location.href = './login.html'
}

const department = document.querySelector('.campBody#department')
const faculty = document.querySelector('.campBody#faculty')
const general = document.querySelector('.campBody#general')
const departmentStatus = department.parentElement.querySelector('.tempBody')
const facultyStatus = faculty.parentElement.querySelector('.tempBody')
const generalStatus = general.parentElement.querySelector('.tempBody')

export function miniProfile(userInfo) {
  userInfo.innerHTML = '<div class="welcome-loading">Loading profile...</div>'

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
          window.location.href = "./login.html"
          return
        }

        if (data.success === false) {
          showToast(data.message)
          return
        }

        const user = data.user
        const avatarUrl = user.passport?.url || '../images/avatar.jpg'
        userInfo.innerHTML = `
        <img class="welcome-avatar" src="${avatarUrl}" alt="">
        <div class="welcome-copy">
          <p class="welcome-kicker">WELCOME BACK</p>
          <h1 class="welcome-name">${user.username}</h1>
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

const buildCard = (candidate, election) => `
  <div class="election-card" id="${election._id}">
    <div class="card-heading">
      <img src="../images/ballot.jpg" alt="">
      <div>
        <p class="card-post-label">Election post</p>
        <h3 class="position">${election.post}</h3>
      </div>
    </div>
    <select name="candidate" id="candidates-${election._id}" class="candidate-select" aria-label="Select a candidate for ${election.post}">
      <option value="" selected disabled>Select a candidate</option>
      ${candidate.map(c => `
        <option value="${c._id}">${c.userId.username}</option>`).join('')}
    </select>
    <button type="button" class="vote" data-election-id="${election._id}">
      <i data-lucide="vote" aria-hidden="true"></i>
      VOTE NOW
    </button>
  </div>
`;

function renderCampaign(elections, container, status) {
  container.replaceChildren()

  if (!Array.isArray(elections) || elections.length === 0) {
    container.hidden = true
    status.hidden = false
    status.textContent = 'No open elections right now.'
    return
  }

  container.hidden = false
  status.hidden = true
  elections.forEach(election => {
    container.insertAdjacentHTML('beforeend', buildCard(election.candidates || [], election))
  })
}

// Initial fetch of elections
function fetchElections() {
  const statuses = [departmentStatus, facultyStatus, generalStatus]
  statuses.forEach(status => {
    status.hidden = false
    status.textContent = 'Loading elections...'
  })

  fetch(`${API_KEY}/user/get-election`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success === false && data.redirect === true) {
        showToast(data.message)
        window.location.href = "./login.html"
        return
      }

      if (data.success === false) {
        statuses.forEach(status => {
          status.hidden = false
          status.textContent = data.message || 'Unable to load elections.'
        })
        showToast(data.message)
        return
      }

      renderCampaign(data.department, department, departmentStatus)
      renderCampaign(data.faculty, faculty, facultyStatus)
      renderCampaign(data.sug, general, generalStatus)
      lucide.createIcons()

      document.querySelectorAll('.vote').forEach(button => {
        button.addEventListener('click', handleVote)
      });
    })
    .catch(err => {
      showToast("Network Error. Please try again")

      statuses.forEach(status => {
        status.hidden = false
        status.textContent = 'Unable to load elections at the moment. Please refresh or check back.'
      })

      console.log('Error: Unable to display elections', err)
    })
}

// Handle vote submission
function handleVote(event) {
  const voteButton = event.currentTarget
  voteButton.disabled = true
  voteButton.textContent = 'SUBMITTING...'

  const electionId = voteButton.getAttribute('data-election-id')
  const candidateSelect = document.querySelector(`#candidates-${electionId}`)
  const candidateId = candidateSelect.value

  if (!candidateId) {
    restoreVoteButton(voteButton)
    showToast('Please select a candidate before voting')
    return
  }

  if (!token) {
    showToast('User not logged in')
    window.location.href = './login.html'
    return
  }

  const voteData = { electionId, candidateId }

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
        restoreVoteButton(voteButton)
        showToast(data.message)
        window.location.href = './login.html'
        return
      }

      if (data.success === false && data.message?.includes('voted')) {
        showToast(data.message)
        voteButton.disabled = true
        voteButton.textContent = 'VOTED'
        return
      }

      if (data.success === false) {
        restoreVoteButton(voteButton)
        showToast(data.message)
        return
      }

      showToast(data.message)
      voteButton.disabled = true
      voteButton.textContent = 'VOTED'
    })
    .catch(err => {
      restoreVoteButton(voteButton)
      showToast(`Error submitting vote ${err.message}`)
      console.error('Vote submission error:', err)
    })
}

function restoreVoteButton(button) {
  button.disabled = false
  button.innerHTML = '<i data-lucide="vote" aria-hidden="true"></i> VOTE NOW'
  lucide.createIcons()
}

//on load
miniProfile(document.querySelector('.profile-abstract'))
fetchElections()

toggleNav()

logout();