export function showMsg(status, type) {
  message.style.display = 'block';

  if (status === 'yes') {
    if (type === 'Login'|| type === 'Signup'){
      message.innerHTML = `<p style="color: green;">${type} successful! Redirecting...</p>`;  
    }
    if (type === 'undefined') {
      alert('Bad response error')
    }
  } else if (status === 'no') {
    if (type === 'password') {
      message.innerHTML = `<p style="color: red;">Password minimum lenght is 6.</p>`;
    }
    if (type === 'file') {
      message.innerHTML = `<p style="color: red; ">Please upload school fee receipt or Id Card</p>`;
    }
    if (type === 'incorrect') {
      message.innerHTML = `<p style="color: red; ">Incorrect matric no or password, kindly register</p>`;
    }
    if (type === 'empty') {
      message.innerHTML = `<p style="color: red;">All field is required</p>`;
    }
    if (type === 'notfound') {
      message.innerHTML = `<p style="color: red;"> User not found, please register</p>`;
    }
  }
}