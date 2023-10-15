const canvas = document.querySelector("#screen");
const blurCanvas = document.createElement('canvas');
const viewPos = document.querySelector("Position")
const ctx = canvas.getContext("2d");
const blurContext = blurCanvas.getContext('2d');

let gravitation = -0;
let period = 4
let initial_x;
let initial_y;
let Dist = 1000;
let time = 60;
let ParticleAmount= 10
let seed = 2
let SmoothingRadius = 1000
let Mass = 1
let pp


let cons_Velocity = Dist/time
let i = 0;
let ParticleSize = 2;


let particleArr = []
let particlePos = []
let PrePos = []
let PreProp = []

/*
canvas.addEventListener("click", event => {
    initial_x = event.clientX
    initial_y = event.clientY

	let new_particle = new Particle(ctx, canvas)
	new_particle.Color = "red"
	new_particle.Size = ParticleSize
	
	

	new_particle.Position = {x:event.clientX, y:event.clientY}

	particleArr.push(new_particle)
	i = 0
	console.log(initial_x+" , "+initial_y)
})
*/
function main(){

	///Statics
	let CenterofAll = newVector(null, window.innerWidth/2, window.innerHeight/2)
	

	for(let i = 0; i< ParticleAmount; i++){

		let x = randomNumber(seed)*window.innerWidth/2
		let y = randomNumber(seed)*window.innerHeight/2

		PrePos[i] = newVector(null, x, y)
		PreProp[i] = BackgroundMap(PrePos[i])

		
	}
	PrePos.forEach(element => {
		let particle = new Particle(ctx, canvas)
		let StartingPos = element
		particle.Position = StartingPos
		particle.Force = 0
		particle.Size = ParticleSize
		particle.Color = "red"
		particle.SmoothingRadius = SmoothingRadius

		particleArr.push(particle)
	});


	//print(PreProp)


	setup.call(ctx)
	setInterval(() => {
		
		
		
		


		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		i++;

		let timestep = i/100
		
		///loops over each particle
		for(k in particleArr){
			let current_Part = particleArr[k]
			let LastPos__ = current_Part.Position
			current_Part.TimeStep = timestep
			current_Part.makeParticle()

			let settingThevEL = current_Part.getVelocity(LastPos__, gravitation)
			
			current_Part.Position = newVector(current_Part, 0, (current_Part.Force + current_Part.Acceleration*current_Part.TimeStep*gravitation))
			particlePos[k] = current_Part.Position

			

			let density = calculateDesnity(CenterofAll)
			let SomeProperty = calculateProperty(CenterofAll, PreProp, PrePos)
			//console.log("the prop"+" "+SomeProperty)
			//console.log("density"+" "+density)



			CollisionResponse(current_Part)	
		

		}

		let density = calculateDesnity(CenterofAll)
		let SomeProperty = calculateProperty(CenterofAll, PreProp, PrePos)
		console.log("the prop"+" "+SomeProperty)
		console.log("density"+" "+density)

		//console.log(particlePos)
		//console.log(PrePos)



	}, cons_Velocity);




}
main()
function setup(){
	this.canvas.width  = window.innerWidth;
	this.canvas.height = window.innerHeight
}


function CollisionResponse(Particle){
	let current_Part = Particle
	if(current_Part.Position.y > window.innerHeight || current_Part.Position.y < 0){
				if(current_Part.Position.y > window.innerHeight){
					current_Part.Position.y = window.innerHeight
					
				}else if(current_Part.Position.y < 100){
					current_Part.Position.y = 1
				}
				current_Part.Force*=-1*current_Part.DampingRate
			}
			if(current_Part.Position.x > window.innerWidth || current_Part.Position.x < 0){
				if(current_Part.Position.x > window.innerWidth){
					current_Part.Position.x = window.innerWidth
					
				}else if(current_Part.Position.y < 100){
					current_Part.Position.x = 1
				}
				current_Part.Force*=-1*current_Part.DampingRate
			}
}
function randomNumber(thresh){
	return (Math.random()*thresh)
}
function BackgroundMap(vector){

	return Math.sin(2*vector.x + Math.E^(Math.cos(vector.y)))

}
function distanceCalc(pos_1x, pos_1y, pos_2x, pos_2y){

	let changeinx = Math.pow((pos_2x-pos_1x), 2)
	let changeiny =	Math.pow((pos_2y-pos_1y), 2)


	let distance = Math.abs(Math.sqrt(changeinx + changeiny)) 


	return distance
}
 function smoothKernalThingy(radius, dist){
	let Volume = Math.PI * Math.pow(radius, 8)/4
	let Val = Math.max(0, (radius * radius) - (dist*dist))
	return Val * Val * Val / Volume
}
function calculateDesnity(somePoint){
	let density = 0
	let mass = Mass || 1

	PrePos.forEach(position => {

		let xpos_2 = position.x
		let ypos_2 = position.y

		let distance = distanceCalc(somePoint.x,somePoint.y, xpos_2, ypos_2)
		
		if(distance >= 0){
			print(distance)
			let influence = smoothKernalThingy(SmoothingRadius, distance)
				//console.log(influence)
			if(influence >= 0){
				density+= mass*influence
			}
		}
	});
	return density
}
function calculateProperty(point, propertyArray, Positions){

	let someProperty = 0
	let vector = point

	for(let i =  0; i<ParticleAmount; i++){


		let dist = distanceCalc(Positions[i].x,  Positions[i].y, vector.x, vector.y)

		if(dist >= 0){
			console.log(dist)
			let influence = smoothKernalThingy(SmoothingRadius, dist)
			
			if(influence >= 0){
				let density = calculateDesnity(Positions[i])
				someProperty+= propertyArray[i]*influence*Mass/density
			}
		}
	}
	return someProperty
}
function newVector( particle_ ,new_x, new_y){

	if (particle_ == null){
		return {x: new_x, y: new_y}
	}else{
		return {x:particle_.Position.x + new_x, y:particle_.Position.y + new_y}
	}
	
}
function print(w){
	console.log(w)
}