export function showMsg(status, type) {
  message.style.display = 'block';
  message.style.color = status === 'yes' ? 'green' : 'red';

  if (status === 'yes') {
    if (type === 'Login'|| type === 'Signup'){
      return 'Redirecting...' ; 
    }
    if (type === 'undefined') {
      alert('Bad response error')
    }
  } else if (status === 'no') {
    if (type === 'password') {
      message.innerHTML = `<p>Password minimum lenght is 6.</p>`;
    }
    if (type === 'file') {
      message.innerHTML = `<p>Please reupload school fee receipt or and Id Card</p>`;
    }
    if (type === 'incorrect') {
      message.innerHTML = `<p>Incorrect matric no or password, kindly register</p>`;
    }
    if (type === 'empty') {
      message.innerHTML = `<p>All field is required</p>`;
    }
    if (type === 'notfound') {
      message.innerHTML = `<p> User not found, please register</p>`;
    }
    if (type === 'exist') {
      message.innerHTML = `<p> User with same details found, kindly login</p>`;
    }
  }
}