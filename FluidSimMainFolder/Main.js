



const canvas = document.querySelector("#screen");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(50, 50, 10, 0, 2 * Math.PI);
ctx.fill()
ctx.stroke();
