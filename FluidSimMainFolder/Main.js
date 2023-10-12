const canvas = document.querySelector("#screen");

canvas.addEventListener("click", () => console.log("Clicked!"))




let i = 0;


function main(){
	const ctx = canvas.getContext("2d");
	setup(ctx);
	setInterval(() => draw(ctx), 100);
}

main()

function setup(ctx){
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight
}


function draw(ctx){
	ctx.beginPath();
	ctx.arc(window.innerWidth/2 + i, window.innerHeight/2, 10, 0, 2 * Math.PI);
	ctx.fill()
	ctx.stroke();
	i++
}
