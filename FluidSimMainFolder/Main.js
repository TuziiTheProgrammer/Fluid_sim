const canvas = document.querySelector("#screen");


let xm;
let ym;
let frameCount = 0;

canvas.addEventListener("click", event => {
    xm = event.clientX - canvas.width/2
    ym = event.clientY - canvas.height/2
    console.log(xm+" , "+ym)
	frameCount=0
})


function main(){
	const ctx = canvas.getContext("2d");
	setup.call(ctx);
	setInterval(() => {
		frameCount++;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		draw.call(ctx)
	}, 1000/60);
}
main()

function setup(){
	this.canvas.width  = window.innerWidth;
	this.canvas.height = window.innerHeight
	canvas.style.backgroundColor = '#005'
}

function Circle(x_){

    let change_x = x
    let change_y = y
    x_.beginPath();
	x_.arc(change_x, y, 10, 0, 2 * Math.PI);
	x_.fill();
	x_.stroke();
}




function draw(){
	var id = this.createImageData(this.canvas.width, this.canvas.height); // only do this once per page
	var d  = id.data;                        // only do this once per page
	for(let i = 0; i < d.length; i+=4){
		d[i] = 255;
		d[i+1] = 255;
		d[i+2] = 255;
		d[i+3] = waveHeight((i/4)%this.canvas.width-this.canvas.width/2, Math.ceil((i/4)/this.canvas.width - this.canvas.height/2));
	}
	this.putImageData(id, 0, 0);
}


function waveHeight(x, y){
	let r = Math.sqrt(Math.pow(x-xm, 2) + Math.pow(y-ym, 2))
	let a = frameCount/4;
	let b = 0.04
	return Math.exp(-Math.pow((b*r-2*a), 2))*190/a
}
