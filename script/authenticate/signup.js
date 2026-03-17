// {
//   import { saveToStorage, users} from "../../data/users.js";
// import {showMsg} from '../utils/message.js';
// import {userIdGen} from '../utils/idGen.js'
// // import {dayjs} from 'https://unpkg.com/dayjs@1.11.19/dayjs.min.js'

// const today = "01 Dec 1990"
// // dayjs().format('ddd M, MMM YYYY (hh:mm A)');


// let facultiesData = null;

// // Load the JSON data
// fetch('../data/deptFac.json')
//   .then(res => res.json())
//   .then(data => {
//     facultiesData = data;
    
//     // Populate faculty dropdown
//     const facultySelect = document.querySelector('#faculty');
//     data.faculties.forEach((faculty) => {
//       const option = document.createElement('option');
//       option.value = faculty.name; // Use the actual faculty name
//       option.textContent = faculty.name;
//       facultySelect.appendChild(option);
//     });
    
//     // Load departments for the first faculty (if any)
//     if (data.faculties.length > 0) {
//       loadDepartments(data.faculties[0].name);
//     }
//   })
//   .catch(_err => console.log('Error loading faculty list', _err));

// // Function to load departments based on selected faculty name
// function loadDepartments(facultyName) {
//   const departmentSelect = document.querySelector('#department');
//   departmentSelect.innerHTML = ''; // Clear existing options
  
//   if (facultiesData) {
//     // Find the faculty by name
//     const faculty = facultiesData.faculties.find(f => f.name === facultyName);
    
//     if (faculty) {
//       faculty.departments.forEach(department => {
//         const option = document.createElement('option');
//         option.value = department;
//         option.textContent = department;
//         departmentSelect.appendChild(option);
//       });
//     }
//   }
// }

// // Listen for faculty selection changes
// document.querySelector('#faculty').addEventListener('change', (e) => {
//   loadDepartments(e.target.value);
// });


// const signinBtn = document.querySelector('.signup')
// const img1 = document.querySelector('.idCard');
// const img2 = document.querySelector('.photo');
// const img3 = document.querySelector('.receipt');

// let idCard, photo, receipt 

// function handleImageUpload(input, callback, storageKey) {
//   const file = input.files[0];
//   if (!file) return;

//   const reader = new FileReader();

//   reader.onload = () => {
//     const imgData = reader.result;
//     callback(imgData);

//     // // Store in localStorage (optional)
//     // localStorage.setItem(storageKey, imgData);

//     console.log(`${storageKey} added`);
//   };

//   reader.readAsDataURL(file);
// }

// // ID Card
// img1.addEventListener('change', () => {
//   handleImageUpload(img1, data => idCard = data, 'idCardImage');
// });

// // Passport Photo
// img2.addEventListener('change', () => {
//   handleImageUpload(img2, data => photo = data, 'passportPhoto');
// });

// // Receipt
// img3.addEventListener('change', () => {
//   handleImageUpload(img3, data => receipt = data, 'receiptImage');
// });


// function signup() {
//   const username = document.querySelector('.name').value;
//   const email = document.querySelector('.email').value;
//   const matric = document.querySelector('.matric').value.toUpperCase();
//   const password = document.querySelector('.password').value.trim();
//   const faculty = document.querySelector('#faculty').value;
//   const department = document.querySelector('#department').value;
//   const level = document.querySelector('#level').value;
//   const radio = document.querySelector('.radio');
  
//   let newuser = {
//     username,
//     email,
//     matric,
//     password,
//     faculty,
//     department,
//     level,
//     userId : userIdGen(),
//     image: {
//       photo, idCard, receipt
//     },
//     status:{
//       voted: false,
//       verified: true
//     },
//     session:{
//       regDate: today,
//       lastLogin: today
//     }
//   }

//   if (!username || !password || !department || !faculty || !level || !matric) {
//     showMsg('no', 'empty')
//     // alert('all field is required')
//     console.log('all field required')
//   } 
//   else{
//     if (password.length >= 6){
//      if (!idCard && !receipt){
//       showMsg('no', 'file')
//       // alert('An id card or school fee reciept must be uploaded')
//        console.log('upload required files')
//       } else {
//         if (idCard == photo || idCard == receipt) {
//           photo = '../images/avatar.jpg'
//           receipt = ''
//         } 
//         if (receipt == photo || receipt == idCard) {
//           receipt = ''
//           idCard = ''
//         }
        
//         showMsg('yes', 'Signup')
//         signinBtn.innerHTML = 'SIGNING IN...';

//         setTimeout(() => {
//           window.location.href = '../pages/login.html'
//         }, 2000);

//         //Save the user here {Pass Info To Backend}
//         users.push(newuser)
//         console.log('signup successful')
//         saveToStorage(users);
//       }
//     } else {
//       showMsg('no', 'password')
//       // alert('Password lenght should atleast be 6(six) character long')
//       console.log('password not long enough');
//     }
//   }
//   console.log(users);
// }
// signinBtn.addEventListener('click', 
//   signup);

// }

import {showMsg} from '../utils/response.js';
import {userIdGen} from '../utils/library.js'
// import {dayjs} from 'https://unpkg.com/dayjs@1.11.19/dayjs.min.js'


const form = document.querySelector('form')
// const today = 'january 1'
// dayjs().format('ddd M, MMM YYYY (hh:mm A)');

const signinBtn = document.querySelector('.signup')
const img1 = document.querySelector('.idCard');
const img2 = document.querySelector('.photo');
const img3 = document.querySelector('.receipt');


let idCard, photo, receipt 

img1.addEventListener('change', ()=>{
  idCard = img1.files[0];
  console.log('ID Card added');
});
img2.addEventListener('change', ()=>{
  photo = img2.files[0];
  console.log('Photo added');
});
img3.addEventListener('change', ()=>{
  receipt = img3.files[0];
  console.log('Receipt added');
});
/*

function handleImageUpload(input, callback, storageKey) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const imgData = reader.result;
    callback(imgData);

    // // Store in localStorage (optional)
    // localStorage.setItem(storageKey, imgData);

    console.log(`${storageKey} added`);
  };

  reader.readAsDataURL(file);
}

// ID Card
img1.addEventListener('change', () => {
  handleImageUpload(img1, data => idCard = data, 'idCardImage');
});

// Passport Photo
img2.addEventListener('change', () => {
  handleImageUpload(img2, data => photo = data, 'passportPhoto');
});

// Receipt
img3.addEventListener('change', () => {
  handleImageUpload(img3, data => receipt = data, 'receiptImage');
});
*/
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
  
  let newuser = {
    username,
    email,
    matric,
    password,
    faculty,
    department,
    level,
    studentId : userIdGen(),
      photo: '../images/avatar.jpg',
      idCard, 
      receipt
  }

  if (!username || !password || !department || !faculty || !level || !matric) {
    showMsg('no', 'empty')
    // alert('all field is required')
    console.log('all field required')
  } 
  else{
    if (password.length >= 6){
     if (!idCard && !receipt){
      showMsg('no', 'file')
      //alert('An id card or school fee reciept must be uploaded')
       console.log('upload required files')
      } else {
        if (idCard == photo || idCard == receipt) {
          photo = '../images/avatar.jpg'
          receipt = ''
        } 
        if (receipt == photo || receipt == idCard) {
          receipt = ''
          idCard = ''
        }

        if (!radio.checked) {
          alert('You must accept terms and conditions to proceed')
          console.log('accept terms and conditions')
          return;
        }
        
        // showMsg('yes', 'Signup')
        // // signinBtn.innerHTML = 'SIGNED IN';

        fetch("http://localhost:3030/api/auth/signup", 
          {
            method:"POST",
            headers :{
              "Content-Type":"application/json"
            },
            body: JSON.stringify(newuser)
          })
            .then(response => response.json())
            .then(data => {
              if (data.status === 404) {
                showMsg('no', 'exists')
                console.log('User already exists');
                return;
              } else if(data.status == 200){
                document.querySelector('#message').innerText = data.message
  
                setTimeout(() => {
                  window.location.href = './login.html'
                }, 2000);
              }
            }).catch(err => console.log(err))

        // console.log('signup successful')
      }
    } else {
      showMsg('no', 'password')
      // alert('Password lenght should atleast be 6(six) character long')
      // console.log('password not long enough');
    }
  }
})



