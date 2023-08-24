const toggle = document.querySelector('.toggle');
const icon = document.querySelectorAll('.icon')
const nav = document.querySelector('.nav')

toggle.onclick = e => {
  toggle.classList.toggle('active');
  icon.forEach(i => {
    i.classList.toggle('active');
  })
  draggable.classList.toggle('active')
}

let shiftX = 0;
let shiftY = 0;

function onMouseMove (e) {
  let x = e.pageX;
  let y = e.pageY;
  draggable.style.left = `${x}px`;
  draggable.style.top = `${y}px`;
}