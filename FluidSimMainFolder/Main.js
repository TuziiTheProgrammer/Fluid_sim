const canvas = document.querySelector("#screen");


let x;
let y;
let i = 0;

canvas.addEventListener("click", event => {
    i = 0
    x = event.clientX
    y = event.clientY
    console.log(x+" , "+y)
})


function main(){
	const ctx = canvas.getContext("2d");
	setup.call(ctx);
	setInterval(() => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		draw.call(ctx)
		i++;
	}, 1000/60);
}
main()

function setup(){
	this.canvas.width  = window.innerWidth;
	this.canvas.height = window.innerHeight
}

function Circle(x_){

    let change_x = x+i
    let change_y = y+i
    x_.beginPath();
	x_.arc(change_x, y, 10, 0, 2 * Math.PI);
	x_.fill();
	x_.stroke();

    if(change_x > window.innerWidth){
        x = 0
        i = 0
    }
}




function draw(){
	Circle(this)
	i++
}
