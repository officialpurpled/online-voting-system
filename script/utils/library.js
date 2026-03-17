// export const API_KEY = 'http://localhost:3030/api';
export const API_KEY = 'https://online-voting-system-backend-xsle.onrender.com/api'

export function userIdGen() {
  return 'VOTER-' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 2000);
}

export function logout() {
  document.getElementById('logout').addEventListener('click', ()=>{
    localStorage.removeItem('p-id');
    alert('Logged out successfully')
    window.location.href = '../index.html'
  })
}