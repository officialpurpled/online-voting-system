import {showMsg} from '../utils/response.js';
import {API_KEY, userIdGen} from '../utils/library.js'

const form = document.querySelector('form')
const message = document.querySelector('#message')

const signinBtn = document.querySelector('.signup')
// const img1 = document.querySelector('.idCard');
const img1 = document.querySelector('.photo');
const img2 = document.querySelector('.receipt');

let photo, receipt
// idCard 

// img1.addEventListener('change', ()=>{
//   idCard = img1.files[0];
//   console.log('ID Card added', idCard);
// });
img1.addEventListener('change', ()=>{
  photo = img1.files[0];
  console.log('Photo added', photo);
});
img2.addEventListener('change', ()=>{
  receipt = img2.files[0];
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
  .catch(err => console.log('Error loading faculty list' + err));

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
    showMsg('no', 'all field is required')
    console.log('all field required')
    return
  }

  if(password.length < 6) {
    showMsg('no', 'Password should be atleast 6')
    return 
  }

  if (!receipt){
    showMsg('no', 'Please reupload school fee receipt or and Id Card')
    console.log('upload required files')
    return
  }

  if (!radio.checked) {
    alert('You must accept terms and conditions to proceed')
    console.log('accept terms and conditions')
    return;
  }

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
  formData.append('passport', photo)
  formData.append('document', receipt)

  try {
    signinBtn.disabled = true
    signinBtn.innerText = 'SIGNING UP...';
    message.innerHTML = ''

    fetch(`${API_KEY}/auth/signup`, {
      method:"POST",
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        signinBtn.disabled = false
        signinBtn.innerText = 'SIGN UP';
        // message.innerHTML = ''
        console.log(response.status) 
        return
      }
      return response.json()
    })
    .then(data => {
      if (data.success === false) {
        signinBtn.disabled = false
        showMsg('no', data.message);
        signinBtn.innerText = 'SIGN UP';
        return
      }

      showMsg('yes', `${data.message}. Redirecting...`);

      window.location.href = './login.html'
    })
  } catch (error) {
    signinBtn.disabled = false
    signinBtn.innerText = 'SIGN UP';
    showMsg('no', 'Please check your connection and try again.')
    // console.log('Error : ' + err)
  }
})