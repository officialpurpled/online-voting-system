import {showMsg} from '../utils/response.js';
import {API_KEY, userIdGen} from '../utils/library.js'

const form = document.querySelector('form')
const message = document.querySelector('#message')

const signinBtn = document.querySelector('.signup')
const img1 = document.querySelector('.idCard');
const img2 = document.querySelector('.photo');
const img3 = document.querySelector('.receipt');

let idCard, photo, receipt 

img1.addEventListener('change', ()=>{
  idCard = img1.files[0];
  console.log('ID Card added', idCard);
});
img2.addEventListener('change', ()=>{
  photo = img2.files[0];
  console.log('Photo added', photo);
});
img3.addEventListener('change', ()=>{
  receipt = img3.files[0];
  console.log('Receipt added', receipt);
});


let facultiesData = null;

// Load the JSON data
fetch('../data/deptFac.json')
  .then(res => res.json())
  .then(data => {
    facultiesData = data;
    
    // Populate faculty dropdown
    const facultySelect = document.querySelector('#faculty');
    data.faculties.forEach((faculty) => {
      const option = document.createElement('option');
      option.value = faculty.name; // Use the actual faculty name
      option.textContent = faculty.name;
      facultySelect.appendChild(option);
    });
    
    // Load departments for the first faculty (if any)
    if (data.faculties.length > 0) {
      loadDepartments(data.faculties[0].name);
    }
  })
  .catch(_err => console.log('Error loading faculty list', _err));

// Function to load departments based on selected faculty name
function loadDepartments(facultyName) {
  const departmentSelect = document.querySelector('#department');
  departmentSelect.innerHTML = ''; // Clear existing options
  
  if (facultiesData) {
    // Find the faculty by name
    const faculty = facultiesData.faculties.find(f => f.name === facultyName);
    
    if (faculty) {
      faculty.departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentSelect.appendChild(option);
      });
    }
  }
}

// Listen for faculty selection changes
document.querySelector('#faculty').addEventListener('change', (e) => {
  loadDepartments(e.target.value);
});

form.addEventListener('submit', (e)=>{
  e.preventDefault();

  const username = document.querySelector('.name').value;
  const email = document.querySelector('.email').value;
  const matric = document.querySelector('.matric').value.toUpperCase();
  const password = document.querySelector('.password').value.trim();
  const faculty = document.querySelector('#faculty').value;
  const department = document.querySelector('#department').value;
  const level = document.querySelector('#level').value;
  const radio = document.querySelector('.radio');
  
  if (!username || !password || !department || !faculty || !level || !matric) {
    showMsg('no', 'empty')
    // alert('all field is required')
    console.log('all field required')
    return
  }

  if(password.length <= 6) return showMsg('no', 'password')

  if (!idCard && !receipt){
    showMsg('no', 'file')
    console.log('upload required files')
    return
  }

  if (!radio.checked) {
    alert('You must accept terms and conditions to proceed')
    console.log('accept terms and conditions')
    return;
  }

  // if (idCard === photo || idCard === receipt) {
  //   photo = '../images/avatar.jpg'
  //   receipt = ''
  // } 
  // if (receipt === photo || receipt === idCard) {
  //   receipt = ''
  //   idCard = ''
  // }

  const formData = new FormData();
  
  formData.append('username', username )
  formData.append('email', email)
  formData.append('matric', matric)
  formData.append('password', password )
  formData.append('faculty', faculty)
  formData.append('department', department)
  formData.append('level', level )
  formData.append('studentId', userIdGen())
  //for images now
  formData.append('profileImg', photo)
  formData.append('idCard', idCard)
  formData.append('receipt', receipt)

  try {
    signinBtn.disabled = true
    signinBtn.innerText = 'SIGNING UP...';
    message.innerText = ''

    fetch(`${API_KEY}/auth/signup`, {
      method:"POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 500) {
        message.innerHTML = `<p> ${data.message} </p>`;
        signinBtn.disabled = false
        signinBtn.innerText = 'SIGN UP';
        console.log('Error signup user. /n Try again later');
      }
      if (data.status === 400) {
        showMsg('no', 'exist');
        signinBtn.disabled = false
        signinBtn.innerText = 'SIGN UP';
        console.log('User already exists');
      }
      if(data.status == 200){
        message.innerHTML = `${data.message}. ${showMsg('yes', 'Signup')}`

        setTimeout(() => {
          window.location.href = './login.html'
        }, 1000);
      }
    })
  } catch (error) {
    signinBtn.disabled = false
    signinBtn.innerText = 'SIGN UP';
    message.innerHTML = "<p> Network Error. <br> Please check your connection and try again.</p>"
    console.log('Error : ' + err)
  }
})