import { API_KEY, logout, showToast } from "./utils/library.js";
import { sideFlow, toggleNav } from "./utils/navFlow.js";

const token = JSON.parse(localStorage.getItem('p-id'))

if (!token || token === undefined) {
  alert("User not logged in \n Please login.")
  window.location.href = './login.html'
}

const avatarEl = document.querySelector('.profile-avatar');
const nameEl = document.querySelector('.profile-name');
const fullNameEl = document.querySelector('.full-name');
const emailEl = document.querySelector('.email-value');
const matricEl = document.querySelector('.matric-value');
const facultyEl = document.querySelector('.faculty-value');
const departmentEl = document.querySelector('.department-value');
const levelEl = document.querySelector('.level-value');
const statusEl = document.querySelector('.status-value-text');
const voteCountEl = document.querySelector('.vote-count');
const voteTextEl = document.querySelector('.vote-count-text');
const verificationPillEl = document.querySelector('.verification-pill');
const verificationStatusEl = document.querySelector('.status-block');
const noticeBoxEl = document.querySelector('.notice-box');

const normalizeStatus = (status = '') => String(status || '').trim().toLowerCase();

function renderProfile(user) {
  const avatar = user?.passport?.url || user?.imageUrl || '../images/avatar.jpg';
  const currentStatus = normalizeStatus(user?.status);
  const isVerified = currentStatus === 'verified';
  const isPending = currentStatus === 'pending';
  const isRejected = currentStatus === 'rejected' || currentStatus === 'declined';

  if (avatarEl) avatarEl.src = avatar;
  if (nameEl) nameEl.textContent = user?.username || 'User';
  if (fullNameEl) fullNameEl.textContent = user?.username || 'Loading...';
  if (emailEl) emailEl.textContent = user?.email || 'Loading...';
  if (matricEl) matricEl.textContent = user?.matric || 'Loading...';
  if (facultyEl) facultyEl.textContent = user?.faculty || 'Loading...';
  if (departmentEl) departmentEl.textContent = user?.department || 'Loading...';
  if (levelEl) levelEl.textContent = user?.level || 'Loading...';
  if (statusEl) statusEl.textContent = user?.status || 'Pending';
  if (voteCountEl) voteCountEl.textContent = user?.votedElections ?? 0;
  if (voteTextEl) voteTextEl.textContent = user?.votedElections ?? 0;

  if (verificationPillEl) {
    const pillText = isVerified ? 'Verified Voter' : isPending ? 'Pending Verification' : isRejected ? 'Rejected' : 'Verification Unavailable';
    const colorClass = isVerified ? 'verified' : isPending ? 'pending' : isRejected ? 'rejected' : 'neutral';
    verificationPillEl.className = `verification-pill ${colorClass}`;
    verificationPillEl.innerHTML = `<i data-lucide="shield-check"></i><span>${pillText}</span>`;
    lucide.createIcons();
  }

  if (verificationStatusEl) {
    const icon = isVerified ? 'check-circle' : isPending ? 'clock-3' : isRejected ? 'x-circle' : 'alert-circle';
    const title = isVerified ? 'Verified' : isPending ? 'Pending' : isRejected ? 'Rejected' : 'Unverified';
    const text = isVerified
      ? 'Your account is verified and you can participate in campus elections.'
      : isPending
        ? 'Your account is currently awaiting approval.'
        : isRejected
          ? 'Your account was rejected and needs review.'
          : 'Your account is not verified yet.';

    const stateClass = isVerified ? 'verified' : isPending ? 'pending' : isRejected ? 'rejected' : 'neutral';
    verificationStatusEl.className = `status-block ${stateClass}`;
    verificationStatusEl.innerHTML = `
      <div class="status-row">
        <i data-lucide="${icon}"></i>
        <span>${title}</span>
      </div>
      <small>${text}</small>
    `;
    lucide.createIcons();
  }

  if (noticeBoxEl) {
    noticeBoxEl.hidden = !isPending;
    if (isPending) {
      noticeBoxEl.innerHTML = `
        <i data-lucide="info"></i>
        <span>Your account is currently being reviewed. You will be notified once it&apos;s verified.</span>
      `;
      lucide.createIcons();
    }
  }
}

function loadData() {
  fetch(`${API_KEY}/user/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success && data.redirect) {
        showToast(data.message);
        window.location.href = './login.html';
        return;
      }

      if (!data.success) {
        if (nameEl) nameEl.textContent = 'Profile unavailable';
        showToast(data.message);
        return;
      }

      renderProfile(data.user);
    })
    .catch(err => {
      console.log(err.message);
      if (nameEl) nameEl.textContent = 'Profile unavailable';
    });
}

document.addEventListener('click', (event) => {
  const backButton = event.target.closest('.back-action');
  if (backButton) {
    window.location.href = './dashboard.html';
    return;
  }

  const editButton = event.target.closest('.profile-action');
  if (editButton) {
    window.location.href = './edit.html';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  sideFlow(document.querySelector('#profile-page'));
  toggleNav();
});

logout();
