const testUser = [];

fetch('http://localhost:3030/users')
  .then((response)=>{
    if (!response.ok) {
      console.log('Bad response')
    }
    return response.json();
  })
  .then(userData => {
    userData.map(user => {
      users.push(user)
    })
  })
  .catch(err => {
    console.log('Error: ', err)
  })

export const users = JSON.parse(localStorage.getItem('users')) || [];

export function saveToStorage(storageKey) {
  localStorage.setItem('users', JSON.stringify(storageKey));
}

export function getFromStorage(storageValue) {
  return JSON.parse(localStorage.getItem(storageValue));
}

export function saveTempUser(storageKey) {
  localStorage.setItem('currentUser', JSON.stringify(storageKey))
}

saveToStorage(users);