const canvas = document.querySelector("#screen");

canvas.addEventListener("click", () => console.log("Clicked!"))




let i = 0;


function main(){
	const ctx = canvas.getContext("2d");
	setup.call(ctx);
	setInterval(draw.bind(ctx), 100);
}

main()

function setup(){
	this.canvas.width  = window.innerWidth;
	this.canvas.height = window.innerHeight
}


function draw(){
	this.beginPath();
	this.arc(window.innerWidth/2 + i, window.innerHeight/2, 10, 0, 2 * Math.PI);
	this.fill()
	this.stroke();
	i++
}
