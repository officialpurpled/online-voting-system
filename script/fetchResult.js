import { API_KEY, logout, showToast } from "./utils/library.js";
import { toggleNav } from "./utils/navFlow.js";

lucide.createIcons()

const token = JSON.parse(localStorage.getItem('p-id'))

if (!token || token === null) {
  alert("Session timeout \n Please login.")
  window.location.href = './login.html'
}

//insert result card into its container right
const getTargetContainer = (mode) => {
  const normalized = (mode ?? '').toLowerCase();

  if (normalized === 'department') return document.querySelector('#dept-modal');
  if (normalized === 'faculty') return document.querySelector('#faculty-modal');
  if (normalized === 'sug' || normalized === 'general') return document.querySelector('#sug-modal');

  return null;
};

//build result card with each candidate data
const buildCard = (candidate, election) => {
  const username = candidate.userId?.username ? candidate.userId.username.toString().toUpperCase() : 'UNKNOWN';
  const department = candidate.userId?.department ? candidate.userId.department.split(' ')[0].toUpperCase() : '';
  const level = candidate.userId?.level ?? '';
  const alias = candidate.alias ? candidate.alias.toString().toUpperCase() : '';
  const imgSrc = candidate.imageUrl || '..images/candidate.jpg'

  return `
  <div class="card">
    <div class="thumbnail">
      <img src="${imgSrc}" alt="${alias}" id="avatar">
      <span>${level}Lv ${department ? ` | ${department}` : ''}</span>
    </div>
    <div class="candidate-stat">
      <div class="candidate-info">
        <p class="candName">${username}</p>
        <p class="candNname">${alias}</p>
        <p class="candPost">${election.post.toUpperCase()}</p>
      </div>
      <div class="candidate-data">
        <p class="vCount">${candidate.votes ?? 0}</p>
        <p class="unit">VOTES</p>
      </div>
    </div>
  </div>
`;
};

//build post section with title and cards
const buildPostSection = (postName, candidates, election) => `
  <div class="post-section">
    <div class="post-title">${postName}</div>
    <div class="card-container">
      ${candidates.map(candidate => buildCard(candidate, election)).join('')}
    </div>
  </div>
`;

// fetch candidate data
function fetchResultData() {
  const deptContainer = document.querySelector('#dept-modal');
  const facultyContainer = document.querySelector('#faculty-modal');
  const sugContainer = document.querySelector('#sug-modal');

  try {
    fetch(`${API_KEY}/user/get-result`, {
      headers: {
        Authorization: `Bearer ${token}`
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
          [deptContainer, facultyContainer, sugContainer].forEach(container => {
            if (container) container.innerHTML = `Error: ${data.message}`;
          });
          return
        }

        // Group elections by mode (department, faculty, sug)
        const groupedByMode = data.reduce((acc, election) => {
          const mode = election.mode?.toLowerCase();
          if (!mode) return acc;
          if (!acc[mode]) acc[mode] = [];
          acc[mode].push(election);
          return acc;
        }, {});

        // For each mode, group by post and build sections
        Object.keys(groupedByMode).forEach(mode => {
          const elections = groupedByMode[mode];
          const container = getTargetContainer(mode);

          if (!container) return;

          // Group elections by post
          const groupedByPost = elections.reduce((acc, election) => {
            const post = election.post;
            if (!acc[post]) acc[post] = [];
            acc[post].push(election);
            return acc;
          }, {});

          container.innerHTML = '';
          // For each post, build section
          Object.keys(groupedByPost).forEach(post => {
            const postElections = groupedByPost[post];
            // Assuming one election per post, take the first
            const election = postElections[0];
            const candidates = election.candidates || [];
            const postSectionHTML = buildPostSection(post, candidates, election);
            container.innerHTML += postSectionHTML;
          });
        });
      })
  } catch (err) {
    showToast('Hello')
    [deptContainer, facultyContainer, sugContainer].forEach(container => {
      if (container) container.innerHTML = 'Unable to display result';
    });
    console.error(err);
  }
}


//onload
document.addEventListener('DOMContentLoaded', () => {
  fetchResultData()
  toggleNav()
})

//logout func
logout();