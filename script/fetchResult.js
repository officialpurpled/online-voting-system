import { API_KEY, logout } from "./utils/library.js";

const token = JSON.parse(localStorage.getItem('p-id'))

if(!token || token === null || token === 'Forbbiden'){
  alert("Session timeout \n Please login.")
  window.location.href = './login.html'
}

//Nav Toggle
(() => {
  const navToggle = document.querySelector('.menu-icon');
  const nav = document.querySelector('nav');
  let navOpen = false;

  const toggleNav = () => {
    if (!nav) return;
    navOpen = !navOpen;
    nav.style.display = navOpen ? 'block' : 'none';
    checkMargin();
  };

  navToggle?.addEventListener('click', toggleNav);

  function checkMargin() {
    const ExResultsEl = document.querySelector('#results');
    
    if (!ExResultsEl) return;
    const cardContainers = document.querySelectorAll('.card-container');

    if (navOpen) {
      ExResultsEl.style.marginLeft = '192px';
      const shouldStack = ExResultsEl.offsetWidth <= 450;
      cardContainers.forEach(card => {
        card.style.gridTemplateColumns = shouldStack ? '1fr' : '';
      });
    } else {
      ExResultsEl.style.marginLeft = '7px';
      cardContainers.forEach(card => {
        card.style.gridTemplateColumns = '';
      });
    }
  }

  window.addEventListener("resize", checkMargin);

  const sectionIds = ['dept-modal', 'faculty-modal', 'sug-modal'];
  
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  sections.forEach(section => {
    section.style.display = 'none';
    section.style.overflow = 'hidden';
    section.style.maxHeight = '0';
    section.style.opacity = '0';
    section.dataset.open = 'false';
  });

  const animateSection = (section, open) => {
    section.style.transition = 'max-height 0.45s ease, opacity 0.45s ease';
    if (open) {
      section.style.display = 'block';
      section.style.maxHeight = '0';
      section.style.opacity = '0';
      section.dataset.open = 'true';
      requestAnimationFrame(() => {
        section.style.maxHeight = `${section.scrollHeight}px`;
        console.log(section.scrollHeight)
        section.style.opacity = '1';
      });
      return;
    }

    section.style.maxHeight = '0';
    section.style.opacity = '0';
    section.dataset.open = 'false';
    setTimeout(() => {
      if (section.dataset.open === 'false') {
        section.style.display = 'none';
      }
    }, 500);
  };

  //needs tweak
  document.querySelectorAll('.resultTab').forEach((tab, index) => {
    const section = sections[index];
    if (!section) return;
    tab.addEventListener('click', () => {
      sections.forEach(sec => {
        animateSection(sec, sec === section);   
      });
    });
  });
})();

//insert result card into its container right
const getTargetContainer = (election) => {
  const mode = election?.mode?.toLowerCase();
  const type = election?.m_type?.toLowerCase();

  if (mode === 'department') return document.querySelector('#dept-modal .card-container');
  if (mode === 'faculty') return document.querySelector('#faculty-modal .card-container');
  if (mode === 'general' || type === 'sug') return document.querySelector('#sug-modal .card-container');

  return null;
};

//build result card with each candidate data
const buildCard = (candidate, election) => `
  <div class="card">
    <div class="thumbnail">
      <img src="${candidate.imageUrl || '../images/avatar.jpg'}" alt="" id="avatar">
      <span>${candidate.userId.level}Lv | ${(candidate.userId.department.split(' ')[0]).toUpperCase()}</span>
    </div>
    <div class="candidate-stat">
      <div class="candidate-info">
        <p class="candName">${candidate.userId.username.toUpperCase()}</p>
        <p class="candNname">${candidate.alias.toUpperCase() || ''}</p>
        <p class="candPost">${election.post.toUpperCase()}</p>
      </div>
      <div class="candidate-data">
        <p class="vCount">${candidate.votes ?? 0}</p>
        <p class="unit">VOTES</p>
      </div>
    </div>
  </div>
`;

// fetch candidate data
async function fetchResultData() {
  const deptContainer = document.querySelector('#dept-modal .card-container');
  const facultyContainer = document.querySelector('#faculty-modal .card-container');
  const sugContainer = document.querySelector('#sug-modal .card-container');

  [deptContainer, facultyContainer, sugContainer].forEach(container => {
    if (container) container.innerHTML = '';
  });

  try {
    const res = await fetch(`${API_KEY}/user/get-result`, {
      headers: { 
        Authorization: `Bearer ${token}` }
      }
    // const res = await fetch(`../data/result.json`
    );
    const data = await res.json();

    data.forEach(election => {
      const container = getTargetContainer(election);
      if (!container) return;

      election.candidates?.forEach(candidate => {
        container.insertAdjacentHTML('beforeend', buildCard(candidate, election));
      });
    });
  } catch (err) {
    [deptContainer, facultyContainer, sugContainer].forEach(container => {
    if (container) container.innerHTML = 'unable to display result';
  });
    console.error(err);
  }
}


//load header profile data
const userInfo = document.querySelector('#ab-user-info');
const loadUserProfile = async () => {
  try {
    const res = await fetch(`${API_KEY}/user/profile`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }
    // const res = await fetch(`../data/users.json`
    );

    if (!res.ok) throw new Error('Unable to load profile');

    const data = await res.json();

    if (userInfo) {
      userInfo.innerHTML = `
        <p>${data.username}</p>
        <p>${data.studentId}</p>
      `;
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//onload
// loadUserProfile()
  // .then(() => 
    // fetchResultData()
  // );

//logout func
logout();