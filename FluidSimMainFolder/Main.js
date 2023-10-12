console.log("Hello World")









const something =()=>{


    const Screen = document.querySelector("screen")


}

something()








const canvas = document.querySelector("#screen");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(100, 75, 50, 0, 2 * Math.PI);
ctx.stroke();
