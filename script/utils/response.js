export function showMsg(status, value) {
  message.style.display = 'block';
  message.style.color = status === 'yes' ? 'green' : 'red';

  message.innerHTML = `<p>${value}</p>`
}