import { API_KEY, logout } from "./utils/library.js";

const token = JSON.parse(localStorage.getItem('p-id'))

if(!token || token === null || token === 'Forbbiden'){
  alert("Unauthorized Access \n Please login.")
  window.location.href = './login.html'
}

let user;

const userInfo = document.querySelector('#ab-user-info');
const loadUserProfile = async () => {
  try {
    const res = await fetch(`${API_KEY}/user/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Unable to load profile');

    const data = await res.json();
    user = data;

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

  document.querySelectorAll('.result').forEach((tab, index) => {
    const section = sections[index];
    if (!section) return;
    tab.addEventListener('click', () => {
      sections.forEach(sec => {
        animateSection(sec, sec === section);   
      });
    });
  });
})();

const getTargetContainer = (election) => {
  const mode = election?.mode?.toLowerCase();
  const type = election?.m_type?.toLowerCase();

  if (mode === 'department') return document.querySelector('#dept-modal .card-container');
  if (mode === 'faculty') return document.querySelector('#faculty-modal .card-container');
  if (mode === 'general' || type === 'sug') return document.querySelector('#sug-modal .card-container');

  return null;
};

const shouldShowElection = (election, currentUser) => {
  const mode = election?.mode?.toLowerCase();
  const type = election?.m_type?.toLowerCase();

  if (mode === 'department') {
    return currentUser?.department && type === currentUser.department.toLowerCase();
  }

  if (mode === 'faculty') {
    return currentUser?.faculty && type === currentUser.faculty.toLowerCase();
  }

  // Show all general/SUG elections to everyone
  return mode === 'general' || type === 'sug';
};

const buildCard = (candidate, election) => `
  <div class="card">
    <div class="thumbnail">
      <img src="${candidate.imageUrl}" alt="" id="avatar">
      <span>${(election.mode || election.m_type || '').toUpperCase()}</span>
    </div>
    <div class="candidate-stat">
      <div class="candidate-info">
        <p class="candName">${candidate.name}</p>
        <p class="candNname">${candidate.alias || ''}</p>
        <p class="candPost">${election.post}</p>
      </div>
      <div class="candidate-data">
        <p class="vCount">${candidate.votes ?? 0}</p>
        <p class="unit">VOTES</p>
      </div>
    </div>
  </div>
`;

async function fetchResultData(currentUser) {
  const deptContainer = document.querySelector('#dept-modal .card-container');
  const facultyContainer = document.querySelector('#faculty-modal .card-container');
  const sugContainer = document.querySelector('#sug-modal .card-container');

  [deptContainer, facultyContainer, sugContainer].forEach(container => {
    if (container) container.innerHTML = '';
  });

  try {
    const res = await fetch(`${API_KEY}/user/results`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    data.forEach(election => {
      if (!shouldShowElection(election, currentUser)) return;

      const container = getTargetContainer(election);
      if (!container) return;

      election.candidates?.forEach(candidate => {
        container.insertAdjacentHTML('beforeend', buildCard(candidate, election));
      });
    });
  } catch (err) {
    console.error(err);
  }
}

// Initialize: load user then fetch and render results
loadUserProfile().then(profile => fetchResultData(profile));
logout();

//Probably or Maybe not needed
// {(() => {
//   const navToggle = document.querySelector('.menu-icon');
//   const nav = document.querySelector('nav');
//   let navOpen = false;


//   const toggleNav = () => {
//     if (!nav) return;
//     navOpen = !navOpen;
//     nav.style.display = navOpen ? 'block' : 'none';
//     checkMargin();
//   };

//   navToggle?.addEventListener('click', toggleNav);

//   function checkMargin() {
//     const ExResultsEl = document.querySelector('#results');
    
//     if (!ExResultsEl) return;
//     const cardContainers = document.querySelectorAll('.card-container');

//     if (navOpen) {
//       ExResultsEl.style.marginLeft = '192px';
//       const shouldStack = resultsEl.offsetWidth <= 450;
//       cardContainers.forEach(card => {
//         card.style.gridTemplateColumns = shouldStack ? '1fr' : '';
//       });
//     } else {
//       ExResultsEl.style.marginLeft = '7px';
//       cardContainers.forEach(card => {
//         card.style.gridTemplateColumns = '';
//       });
//     }
//   }

//   window.addEventListener("resize", checkMargin);

//   const sectionIds = ['dept-modal', 'faculty-modal', 'sug-modal'];
  
//   const sections = sectionIds
//     .map(id => document.getElementById(id))
//     .filter(Boolean);

//   sections.forEach(section => {
//     section.style.display = 'none';
//     section.style.overflow = 'hidden';
//     section.style.maxHeight = '0';
//     section.style.opacity = '0';
//     section.dataset.open = 'false';
//   });

//   const animateSection = (section, open) => {
//     section.style.transition = 'max-height 0.45s ease, opacity 0.45s ease';
//     if (open) {
//       section.style.display = 'block';
//       section.style.maxHeight = '0';
//       section.style.opacity = '0';
//       section.dataset.open = 'true';
//       requestAnimationFrame(() => {
//         section.style.maxHeight = `${section.scrollHeight}px`;
//         section.style.opacity = '1';
//       });
//       return;
//     }

//     section.style.maxHeight = '0';
//     section.style.opacity = '0';
//     section.dataset.open = 'false';
//     setTimeout(() => {
//       if (section.dataset.open === 'false') {
//         section.style.display = 'none';
//       }
//     }, 500);
//   };

//   document.querySelectorAll('.result').forEach((tab, index) => {
//     const section = sections[index];
//     if (!section) return;
//     tab.addEventListener('click', () => {
//       sections.forEach(sec => {
//         animateSection(sec, sec === section);   
//       });
//     });
//   });
// })();

// function renderResult() {
  
// }
// function fetchResultData(usersId) {
//   fetch('localhost:3030/api/users/election', {
//     method: 'GET',
//     headers: {
//       Bearer: token
//     },
//     body: json.stringify({usersId})
//   })
//   .then(res => res.json())
//   .then((data) => {
//     if(data[0].department == users.department){
      
//     }
//     console.log(data)
//   })
// }
// }
