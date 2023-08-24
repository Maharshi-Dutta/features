// const letter="ABCDEFGHIJKLMNOPQRSTUVWXYZ"


// document.querySelector("h1").onmouseover= Event=>{
//     itt=0;
//     const interval=setInterval(()=>{
//     Event.target.innerText.split()=Event.target.innerText.split("").map(letter[Math.floor(Math.random()*26)])
//     .join("");
//     if(itt>=9)clearInterval(interval);
//     itt+=1;
//      },
//       100);
// }
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

const  nam = document.querySelector("h1").screen.onmouseenter = event => {  
  let iteration = 0;
  
  clearInterval(interval);
  
  interval = setInterval(() => {
    nam.innerText = nam.innerText
      .split("")
      .map((letter, index) => {
        if(index < iteration) {
          return nam.dataset.value[index];
        }
      
        return letters[Math.floor(Math.random() * 26)]
      })
      .join("");
    
    if(iteration >= nam.dataset.value.length){ 
      clearInterval(interval);
    }
    
    iteration += 1 / 3;
  }, 30);
}