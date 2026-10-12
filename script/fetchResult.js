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

const sortCandidates = (candidates = []) => {
  return [...candidates].sort((first, second) => {
    const firstVotes = Number(first?.votes ?? 0);
    const secondVotes = Number(second?.votes ?? 0);
    return secondVotes - firstVotes;
  });
};

const getModeTitle = (mode = '') => {
  const normalized = (mode ?? '').toLowerCase();

  if (normalized === 'department') return 'Departmental Results';
  if (normalized === 'faculty') return 'Faculty Results';
  if (normalized === 'sug' || normalized === 'general') return 'Student Union Results';

  return 'Election Results';
};

const getVotePercentage = (candidateVotes, totalVotes) => {
  if (!totalVotes || Number(totalVotes) <= 0) return 0;
  return (Number(candidateVotes ?? 0) / Number(totalVotes)) * 100;
};

const applyResultFilter = (selectedFilter = 'all') => {
  const filterButtons = document.querySelectorAll('.result-filter-btn');
  const resultCollections = document.querySelectorAll('.result-collection');

  filterButtons.forEach(item => {
    item.classList.toggle('active', (item.dataset.filter || 'all') === selectedFilter);
  });

  resultCollections.forEach(section => {
    const match = selectedFilter === 'all' || section.dataset.mode === selectedFilter;
    section.classList.toggle('is-hidden', !match);
    section.hidden = !match;
  });
};

const bindResultFilters = () => {
  const filterButtons = document.querySelectorAll('.result-filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter || 'all';
      applyResultFilter(selected);
    });
  });

  document.querySelectorAll('.result-mode-header button').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.result-collection');
      if (!section) return;
      section.classList.toggle('collapsed');
      const indicator = button.querySelector('.toggle-indicator');
      if (indicator) {
        indicator.innerHTML = section.classList.contains('collapsed') ? '<i data-lucide="chevron-right"></i>' : '<i data-lucide="chevron-down"></i>';
      }
      lucide.createIcons()
    });
  });

  applyResultFilter('all');
};

//build result card with each candidate data
const buildCard = (candidate, election, totalVotes, isWinner = false) => {
  const username = candidate.userId?.username ? candidate.userId.username.toString().toUpperCase() : 'UNKNOWN';
  const department = candidate.userId?.department ? candidate.userId.department.split(' ')[0].toUpperCase() : '';
  const level = candidate.userId?.level ?? '';
  const alias = candidate.alias ? candidate.alias.toString().toUpperCase() : '';
  const imgSrc = candidate.imageUrl || '../images/candidate.jpg';
  const percentage = getVotePercentage(candidate.votes, totalVotes);

  lucide.createIcons()
  return `
  <div class="card">
    <div class="thumbnail">
      <img src="${imgSrc}" alt="${alias || username}" id="avatar">
      <span class="result-badge">${department ? ` ${department}` : ''}</span>
    </div>
    <div class="candidate-stat">
      <div class="candidate-info">
       <div class="info-left">
          <p class="candName">${username}</p>
          <p class="candNname">${alias}</p>
          <p class="candPost">${level ? ` ${level} Level` : 'STUDENT'}</p>
        </div>
        ${isWinner ? `
          <div class="info-right">
            <i data-lucide="square-star"></i>
          </div>
          `
      : ''}
      </div>

      <div class="candidate-metrics">
        <div class="percent-row">
          <span class="vCount">${candidate.votes ?? 0}</span>
          <span class="percent-value">${percentage.toFixed(1)}%</span>
        </div>
        <div class="vote-bar" aria-label="Percentage of votes">
          <i style="width: ${Math.min(100, percentage)}%"></i>
        </div>
      </div>
    </div>
  </div>
`;
};

//build post section with title and cards
const buildPostSection = (postName, candidates, election) => {
  const sortedCandidates = sortCandidates(candidates);
  const totalVotes = sortedCandidates.reduce((sum, candidate) => sum + Number(candidate?.votes ?? 0), 0);
  if (!sortedCandidates.length) {
    return `
      <div class="post-section">
        <div class="post-title">${postName}</div>
        <div class="empty-state">No result available for this category yet.</div>
      </div>
    `;
  }

  return `
    <div class="post-section">
      <div class="post-title">${postName}</div>
      <div class="card-container">
        ${sortedCandidates.map((candidate, index) => buildCard(candidate, election, totalVotes, index === 0)).join('')}
      </div>
    </div>
  `;
};

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
          window.location.href = "./login.html"
          return
        }

        if (data.success === false) {
          [deptContainer, facultyContainer, sugContainer].forEach(container => {
            if (container) container.innerHTML = `Error: ${data.message}`;
          });
          return
        }

        localStorage.setItem('election-results', JSON.stringify(data));
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

          const groupedByPost = elections.reduce((acc, election) => {
            const post = election.post;
            if (!acc[post]) acc[post] = [];
            acc[post].push(election);
            return acc;
          }, {});

          container.innerHTML = `
            <div class="result-mode-header">
              <button type="button">
                <h2>${getModeTitle(mode)}</h2>
                <span class="toggle-indicator">
                  <i data-lucide="chevron-down"></i>
                </span>
              </button>
            </div>
            <div class="result-mode-content">
            </div>
          `;

          const contentTarget = container.querySelector('.result-mode-content');

          Object.keys(groupedByPost).forEach(post => {
            const postElections = groupedByPost[post];
            const election = postElections[0];
            const candidates = election.candidates || [];
            const postSectionHTML = buildPostSection(post, candidates, election);
            if (contentTarget) contentTarget.innerHTML += postSectionHTML;
          });
        });

        bindResultFilters();
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
  fetchResultData();
  toggleNav();
  bindResultFilters();
})

//logout func
logout();