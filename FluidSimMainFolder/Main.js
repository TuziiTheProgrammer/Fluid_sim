



const canvas = document.querySelector("#screen");

canvas.addEventListener("click", () => console.log("Clicked!"))

const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.beginPath();
ctx.arc(50, 50, 10, 0, 2 * Math.PI);
ctx.fill()
ctx.stroke();
