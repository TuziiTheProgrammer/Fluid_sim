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
let ParticleAmount= 30
let seed = 2
let SmoothingRadius = 1000
let Mass = 5
let pressMul = 2
let TargetDensity = 1



let cons_Velocity = Dist/time
let i = 0;
let ParticleSize = 5;


let particleArr = []
let particlePos = []
let PrePos = []
let PreProp = []
let DensityArr = []
let VelocityArr = []

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
	let StoredParticle
	
	///Sets where they will spawn
	for(let i = 0; i< ParticleAmount; i++){

		let x = randomNumber(seed)*window.innerWidth/2
		let y = randomNumber(seed)*window.innerHeight/2

		PrePos[i] = newVector(null, x, y)
		PreProp[i] = BackgroundMap(PrePos[i])

		
	}

	///Builds the Particles in Array
	PrePos.forEach(element => {
		let particle = new Particle(ctx, canvas)
		let StartingPos = element
		particle.Position = StartingPos
		particle.Force = 1
		particle.Mass = Mass
		particle.Size = ParticleSize
		particle.Color = "red"
		particle.SmoothingRadius = SmoothingRadius
		
		VelocityArr.push(particle.Velocity)
		particleArr.push(particle)
	});

	
	setup.call(ctx)

	setInterval(() => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		i++;


		let timestep = i/100

		///set velocities and gravity and density
		for(k in particleArr){
			let particle = particleArr[k]
			particle.TimeStep = timestep
			particlePos[k] = particle.Position

			let VelocityInX = particle.ForceX + particle.Acceleration*particle.TimeStep*gravitation
			let VelocityInY = particle.Force + particle.Acceleration*particle.TimeStep*gravitation
			VelocityArr[k] = newVector(null, VelocityInX, VelocityInY)
			particle.setVelocity(VelocityArr[k])


			let density = calculateDesnity(particlePos[k])
			DensityArr[k] = density
		}
		///Calcualte Pressures
		for(k in particleArr){
			let particle = particleArr[k]
			particle.TimeStep = timestep
			
			let pressureForce = CalculatePressureGradiant(k)

			let pressAcceleration = VectorScalarMultp(pressureForce, 1/DensityArr[k])
			
			VelocityArr[k] = VectorAddWith_S_Multiplier(VelocityArr[k], VectorScalarMultp(pressAcceleration, pressMul*particle.TimeStep), 1)

		}
		///Update Positions loops over each particle to add some rules
		for(let k in particleArr){
			//StoredParticle = particleArr[k]
			let current_Part = particleArr[k]
			let LastPos__ = current_Part.Position
			current_Part.TimeStep = timestep
			current_Part.makeParticle()
			particlePos[k] = current_Part.Position
			
			current_Part.Position = newVector(current_Part, current_Part.Velocity.x, current_Part.Velocity.y)
			
			CollisionResponse(current_Part)		
		}
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
				
				current_Part.ForceX*=-1*current_Part.DampingRate
				
				
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
function smoothKernalDerv(radius, dist){

	if(dist>=radius){return 0}
	let f = Math.pow(radius, 2)-Math.pow(dist, 2)
	let f_ = -24/(Math.PI * Math.pow(radius, 8))
	return f_ * dist * f * f
}
function calculateDesnity(somePoint){
	let density = 0
	let mass = Mass || 1

	for (const k in particlePos) {

		let position = particlePos[k]

		let xpos_2 = position.x
		let ypos_2 = position.y
		
		

		let distance = distanceCalc(somePoint.x,somePoint.y, xpos_2, ypos_2)
		
		if(distance >= 0){
			
			let influence = smoothKernalThingy(SmoothingRadius, distance)
			
			
			if(influence >= 0){
				density+= mass*influence
			}
		}
	}
	return density
}
function calculateProperty(point, propertyArray, Positions){

	let someProperty = 0
	let vector = point

	for (const k in Positions) {
		let xpos2 = Positions[k].x
		let ypos2 = Positions[k].y
		


		let dist = distanceCalc(vector.x,  vector.y, xpos2, ypos2)

		if(dist >= 0){
			
			let influence = smoothKernalThingy(SmoothingRadius, dist)
			
			if(influence >= 0){
				let density = calculateDesnity(point, Positions)
				
				someProperty+= propertyArray[i]*Mass/density*influence
			}
		}


	}
	return someProperty
}
function convertDensity(density){

	let errord = density - TargetDensity
	let pressure = errord*pressMul

	return pressure

}
function newVector(particle_ ,new_x, new_y){

	if (particle_ == null){
		return {x: new_x, y: new_y}
	}else if(particle_ instanceof Particle){

		return {x:particle_.Position.x + new_x, y:particle_.Position.y + new_y}
	}else{
		return {x:particle_.x + new_x, y:particle_.y + new_y}
	}
}
function CalculatePropertyGradiant(point, propertyArray, Positions){

	let propertyGrad = newVector(null, 0,0)

	for (const k in Positions) {
		let xpos2 = Positions[k].x
		let ypos2 = Positions[k].y
		


		let dist = distanceCalc(point.x,  point.y, xpos2, ypos2)

		if(dist >= 0){
			let dir = VectorSubtractWith_S_Multipler(Positions[k], point, 1/dist)
			let slope = smoothKernalDerv(SmoothingRadius, dist)
			let density = DensityArr[k]
	
			propertyGrad = VectorScalarMultp(VectorAddWith_S_Multiplier(propertyGrad, dir), -propertyArray[i]*slope*Mass/density*influence)
		}
	}
}
function CalculatePressureGradiant(pointIndex){

	let pressureGrad = newVector(null, 0,0)

	for (const k in particlePos) {
		let xpos2 = particlePos[k].x
		let ypos2 = particlePos[k].y
		
		if(pointIndex == k){
			continue;
		}
		let dist = distanceCalc(particlePos[pointIndex].x,  particlePos[pointIndex].y, xpos2, ypos2)

		if(dist >= 0){
			let dir = dist == 0 ? RandDirection() : VectorSubtractWith_S_Multipler(particlePos[pointIndex], particlePos[k], 1/dist) 
			
			

			let slope = smoothKernalDerv(SmoothingRadius, dist)
			let density = DensityArr[k]
			
			
			pressureGrad = VectorScalarMultp(VectorAddWith_S_Multiplier(pressureGrad, dir), -convertDensity(density)*slope*Mass/density)
			
		}
	}

	//console.log(pressureGrad)

	

	return pressureGrad
}
function VectorSubtractWith_S_Multipler(vecy, vecx, multiply){

	let Mult = multiply||1

	let x_comp = vecx.x - vecy.x
	let y_comp = vecx.y - vecy.y
	return newVector(null, x_comp*Mult, y_comp*Mult)
}
function VectorAddWith_S_Multiplier(vecy, vecx, multiply){

	let Mult = multiply||1
	let x_comp = vecx.x + vecy.x
	let y_comp = vecx.y + vecy.y
	return newVector(null, x_comp*Mult, y_comp*Mult)
}
function VectorScalarMultp(vector, scalars){
	let x_comp = vector.x
	let y_comp = vector.y
	return newVector(null, x_comp*scalars, y_comp*scalars)
}
function RandDirection(){

	let vectorT = [
		newVector(null, 1, 0),
		newVector(null, -1, 0),
		newVector(null, 0, 1),
		newVector(null, 0, -1),

	]

	let randVec = vectorT[Math.floor(Math.random()*4)]

	
	if(randVec.x != NaN && randVec.y != NaN){
		
		return randVec
	}
	
	return randVec
	


}
function print(w){
	console.log(w)
}
function wait(s) {
	return new Promise(resolve => setTimeout(resolve, s*1000));
 }