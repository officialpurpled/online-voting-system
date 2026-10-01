import { API_KEY, userIdGen } from '../utils/library.js'
import { validateInput } from '../utils/regex.js';
import { toggleNav } from '../utils/navFlow.js';

lucide.createIcons()
toggleNav()

const form = document.querySelector('form')
const feedback = document.querySelector('#message')
const signupButton = document.querySelector('.signupBtn')
const signupButtonText = signupButton.querySelector('.btn-text')
const nameInput = document.querySelector('.fullname')
const emailInput = document.querySelector('.email')
const matricInput = document.querySelector('.matric')
const passwordInput = document.querySelector('.password')
const facultySelect = document.querySelector('#faculty')
const departmentSelect = document.querySelector('#department')
const levelSelect = document.querySelector('#level')
const consentInput = document.querySelector('#terms-consent')
const receiptZone = document.querySelector('#receipt')
const selfieZone = document.querySelector('#selfie')
const receiptInput = document.querySelector('#receipt-file')
const selfieInput = document.querySelector('#selfie-file')

let passportFile = null
let documentFile = null
let facultiesData = null;

bindUploadZone(receiptZone, receiptInput, 'document')
bindUploadZone(selfieZone, selfieInput, 'passport')

fetch('../data/deptFac.json')
  .then(res => res.json())
  .then(data => {
    facultiesData = data;

    data.faculties.forEach((faculty) => {
      const option = document.createElement('option');
      option.value = faculty.name;
      option.textContent = faculty.name;
      facultySelect.appendChild(option);
    });
  })
  .catch(err => console.log('Error loading faculty list' + err));

function loadDepartments(facultyName) {
  departmentSelect.innerHTML = '<option value="" selected disabled>Select your department</option>';

  if (facultiesData) {
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

facultySelect.addEventListener('change', (e) => {
  loadDepartments(e.target.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = nameInput.value.trim();
  const email = emailInput.value.trim();
  const matric = matricInput.value.trim();
  const password = passwordInput.value.trim();
  const faculty = facultySelect.value;
  const department = departmentSelect.value;
  const level = levelSelect.value;

  if (!username || !password || !department || !faculty || !level || !matric) {
    setFeedback('no', 'All fields are required.')
    return
  }

  const validate = validateInput(matric)

  if (!validate.isValid) {
    setFeedback('no', 'Invalid matriculation or registration number format.')
    return
  }

  if (password.length < 6) {
    setFeedback('no', 'Password must be at least 6 characters.')
    return
  }

  if (!documentFile) {
    setFeedback('no', 'Please upload your school fee receipt or student ID card.')
    return
  }

  if (!consentInput.checked) {
    setFeedback('no', 'Please accept the terms and conditions to continue.')
    return;
  }

  const formData = new FormData();

  formData.append('username', username)
  formData.append('email', email)
  formData.append('matric', validate.formatted)
  formData.append('password', password)
  formData.append('faculty', faculty)
  formData.append('department', department)
  formData.append('level', level)
  formData.append('studentId', userIdGen())
  if (passportFile) formData.append('passport', passportFile)
  formData.append('document', documentFile)

  signupButton.disabled = true
  signupButtonText.textContent = 'CREATING ACCOUNT...'
  setFeedback('', '')

  try {
    const response = await fetch(`${API_KEY}/auth/signup`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()

    if (!response.ok || data.success === false) {
      throw new Error(data.message || `Sign up failed (${response.status}).`)
    }

    setFeedback('yes', `${data.message || 'Account created successfully.'} Redirecting...`)
    window.location.href = './login.html'
  } catch (error) {
    setFeedback('no', error.message || 'Please check your connection and try again.')
    signupButton.disabled = false
    signupButtonText.textContent = 'SIGN UP'
  }
})

function bindUploadZone(zone, input, fileType) {
  zone.addEventListener('click', () => input.click())
  zone.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    input.click()
  })

  input.addEventListener('change', () => {
    setSelectedFile(input.files[0], zone, fileType)
  })

  zone.addEventListener('dragover', (event) => {
    event.preventDefault()
    zone.classList.add('dragging')
  })

  zone.addEventListener('dragleave', (event) => {
    if (!zone.contains(event.relatedTarget)) zone.classList.remove('dragging')
  })

  zone.addEventListener('drop', (event) => {
    event.preventDefault()
    zone.classList.remove('dragging')
    setSelectedFile(event.dataTransfer.files[0], zone, fileType)
  })
}

function setSelectedFile(file, zone, fileType) {
  if (!file) return

  const extension = file.name.split('.').pop().toLowerCase()
  const isSupportedImage = ['image/jpeg', 'image/png'].includes(file.type) || ['jpg', 'jpeg', 'png'].includes(extension)
  if (!isSupportedImage) {
    setFeedback('no', 'Choose a JPG or PNG image.')
    return
  }

  if (file.size > 4 * 1024 * 1024) {
    setFeedback('no', 'Each image must be 4 MB or smaller.')
    return
  }

  if (fileType === 'document') documentFile = file
  else passportFile = file

  zone.classList.add('selected')
  zone.querySelector('[data-upload-title]').textContent = file.name
  zone.querySelector('[data-upload-help]').textContent = `${formatFileSize(file.size)} selected`
  setFeedback('', '')
}

function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function setFeedback(status, text) {
  feedback.textContent = text
  feedback.style.display = text ? 'block' : 'none'
  feedback.style.color = status === 'yes' ? 'green' : 'red'
}