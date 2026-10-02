// export const API_KEY = 'http://localhost:3030/api';
export const API_KEY = 'https://online-voting-system-backend-xsle.onrender.com/api'

export function userIdGen() {
  return 'VOTER-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 1000);
}

export function showToast(message) {
  const t = document.getElementById('notisModal');
  if (!t) return;

  t.innerText = message || 'Message parsing error';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

export function logout() {
  const logoutLink = document.getElementById('logout')
  if (!logoutLink) return

  logoutLink.addEventListener('click', (event) => {
    event.preventDefault()
    localStorage.removeItem('p-id');
    window.location.href = '../index.html'
  })
}