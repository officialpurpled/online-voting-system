lucide.createIcons()

import { toggleNav } from './utils/navFlow.js'

toggleNav()


const timeElem = document.getElementById('currentTime')

setInterval(() => {
  const today = new Date()

  let hours = today.getHours()
  const minutes = today.getMinutes().toString().padStart(2, '0')
  const seconds = today.getSeconds().toString().padStart(2, '0')
  // const time = [today.getHours(), today.getMinutes(), today.getSeconds()]

  let ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours ? hours : 12

  timeElem.innerText = `${hours.toString().padStart(2, '0')} : ${minutes} : ${seconds} ${ampm} `

  // timeElem.join(':')
  // console.log(time)
}, 1000)

