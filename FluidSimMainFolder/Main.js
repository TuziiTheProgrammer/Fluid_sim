/*


	Course: Interaction Design
	University: Malmo university

	TITLE: Particle fluid simulation
	MADE BY: JEREMIAH LASSEN-HOLM

	If youre wondering why this doesnt look like the template its because I wasnt aware there was a template
	and buildt everything from scratch. MY BAD!!!!


*/
const canvas = document.querySelector("#screen");
const blurCanvas = document.createElement('canvas');
const viewPos = document.querySelector("Position")
const ctx = canvas.getContext("2d");
const blurContext = blurCanvas.getContext('2d');// also useless for now 
const worker = new Worker("worker.js") // useless and was a pain to use. with there was just proper multithreading


let period = 0
let initial_x;
let initial_y;
let Dist = 1000;
let time = 60;
let seed = 2

///TWEEKABLE THINGS    DO NOT TWEEK ANYTHING ELSE YOU WILL MESS UP THE CODE AND THE CONSOLE WILL SCREAM AT YOU :))))))))))
let gravitation = -0;
let ParticleAmount = 300
let SmoothingRadius = 25
let Mass = 10
let pressMul = 0.5
let TargetDensity = .5
let Acceleration = 0.01
let radius_ = 100
let Strength_ = 15
let ParticleSize = 5;
/////////

/*

	IF YOU DONT LIKE THE PARTICLES STATIC WHEN RUN GO TO "Bulids Particle Array(line 84)" AND CHANGE THE FORCES :))))) THOSE WILL
	BE THE VECTORS. CURRENTLY TO LAZY TO ADD IN UI FOR RUNTIME TWEEKING BUT I EVENTUALLY WILL.


	HAVE FUN TWEEKING STUFF TO YOUR LIKING. ADDING MOE PARTICLES MAKES THE VISUALIZATION BETTER BUT MAYBE LAPTOP IS TOO
	POTATOE TO RUN MORE THAN 400 SADLY.


*/

let cons_Velocity = Dist/time
let i = 0;



let particleArr = []
let particlePos = []
let PrePos = []
let PreProp = []
let DensityArr = []
let VelocityArr = []
let wheremouseat = newVector(null,0,0)
let whereMouseHold = newVector(null, 0, 0)
let MouseDown = false
let MouseMoving = false

canvas.addEventListener("pointermove", event => {
	wheremouseat = newVector(null, event.clientX, event.clientY)
	MouseMoving = true
   
})
canvas.addEventListener("mousedown", event =>{
	MouseDown = true
	MouseMoving = false
	whereMouseHold = newVector(null, event.clientX, event.clientY)

})
canvas.addEventListener("mouseup", even =>{
	MouseDown = false
	MouseMoving = true
})

///Where everything happens
function main(){

	///Statics
	let CenterofAll = newVector(null, window.innerWidth/2, window.innerHeight/2)
	
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
		particle.Force = 0
		particle.ForceX = 0
		particle.Mass = Mass
		particle.Size = ParticleSize
		particle.Color = 'rgb(0, 191, 255)'
		particle.Acceleration = Acceleration
		particle.SmoothingRadius = SmoothingRadius
		particle.density = calculateDesnity(particle.Position)
		
		VelocityArr.push(particle.Velocity)
		particleArr.push(particle)
		particlePos.push(particle.Position)
		DensityArr.push(particle.density)

	});
	
	setup.call(ctx)

	///Frames start here
	setInterval(() => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		i++;

		let timestep = i/100

		///set velocities and gravity and density	
		for(let k in particleArr){

			let particle = particleArr[k]
			particle.TimeStep = timestep
			particlePos[k] = particle.Position
			
			let VelocityInX = particle.ForceX + particle.Acceleration*particle.TimeStep*gravitation
			let VelocityInY = particle.Force + particle.Acceleration*particle.TimeStep*gravitation
			VelocityArr[k] = newVector(null, VelocityInX, VelocityInY)
			particle.setVelocity(VelocityArr[k])

			let density = calculateDesnity(particlePos[k])
			particle.Density = density
			DensityArr[k] = particle.Density
		}
		///Calcualte Pressures
		for(let k in particleArr){
			let particle = particleArr[k]
			particle.TimeStep = timestep
			let pressureForce = CalculatePressureGradiant(k)
			let IntForce
			
			particle.PressForce = pressureForce

			let pressAcceleration = VectorScalarMultp(particle.PressForce, 1/particle.Density)

			if(MouseDown == true){
				IntForce = InteractionForce(wheremouseat, radius_, Strength_*3, k, -1)

			}else{
				IntForce = InteractionForce(wheremouseat, radius_, Strength_, k, 1)
			}

			particle.ForceX+=pressAcceleration.x + IntForce.x
			particle.Force +=pressAcceleration.y + IntForce.y

		}
		///Update Positions loops over each particle to add some rules
		for(let k in particleArr){
			let current_Part = particleArr[k]
		
			current_Part.TimeStep = timestep
			current_Part.makeParticle()

			particlePos[k] = current_Part.Position
			
			current_Part.Position = newVector(current_Part, current_Part.Velocity.x, current_Part.Velocity.y)

			
			
			CollisionResponse(current_Part)
			adjustColorBySpeed(current_Part, 0, 15)
			

		}
	}, cons_Velocity);
}
main()

/////Funcitons Etc
function setup(){
	this.canvas.width  = window.innerWidth;
	this.canvas.height = window.innerHeight
}
function velocityColorGrad(particle){

	let convertToColor = {x:191 - 10*particle.Force, y: 1}
	particle.Color = `rgb(0, ${convertToColor.x}, 255`;
}
function InteractionForce(input, radius, strength, particleIndex, switch_){
	let interactionForce = newVector(null, 0, 0)
	let offset = VectorSubtractWith_S_Multipler(input, particlePos[particleIndex], 1) 
	let sqrDIST = VectorDot(offset, offset)

	
	
	if(sqrDIST < radius*radius){
		let dst = Math.sqrt(sqrDIST)
		let dirtoInp = dst <= Number.EPSILON ? newVector(null, 0, 0) : VectorScalarMultp(offset, switch_*1/dst)

		console.log(dirtoInp)

		let center = 1-dst/radius

		interactionForce = VectorSubtractWith_S_Multipler(VelocityArr[particleIndex],VectorScalarMultp(dirtoInp, strength), center)
	}

	
	return interactionForce
}
function adjustColorBySpeed(particle, minSpeed, maxSpeed) {
    // Get the particle's velocity
    const velocity = Math.sqrt(particle.Velocity.x ** 2 + particle.Velocity.y ** 2);

    // Map the velocity to a heat map color gradient
    const color = mapSpeedToHeatMapColor(velocity, minSpeed, maxSpeed);

    // Set the particle's color based on the gradient
    particle.Color = color;
    // Update the particle's visual representation as needed
}
function mapSpeedToHeatMapColor(speed, minSpeed, maxSpeed) {
    const colorStops = [
        { speed: minSpeed, color: [0, 191, 255] },    
        { speed: maxSpeed, color: [255, 165, 0] }    
    ];

    if (speed <= minSpeed) {
        return rgbToHex(colorStops[0].color);
    }
    if (speed >= maxSpeed) {
        return rgbToHex(colorStops[1].color);
    }

    // Find the appropriate color stop based on speed
    for (let i = 0; i < colorStops.length - 1; i++) {
        const startStop = colorStops[i];
        const endStop = colorStops[i + 1];

        if (speed >= startStop.speed && speed <= endStop.speed) {
            const t = (speed - startStop.speed) / (endStop.speed - startStop.speed);
            const r = interpolate(startStop.color[0], endStop.color[0], t);
            const g = interpolate(startStop.color[1], endStop.color[1], t);
            const b = interpolate(startStop.color[2], endStop.color[2], t);
            return rgbToHex([Math.round(r), Math.round(g), Math.round(b)]);
        }
    }

    return rgbToHex(colorStops[0].color); 
}
function interpolate(start, end, t) {
    return start + (end - start) * t;
}
function rgbToHex(rgbArray) {
    return `#${rgbArray.map(component => component.toString(16).padStart(2, '0')).join('')}`;
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
	return (Val * Val * Val) / Volume
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

	particlePos.forEach(position => {
		let xpos_2 = position.x
		let ypos_2 = position.y
	
		let distance = distanceCalc(somePoint.x,somePoint.y, xpos_2, ypos_2)
		
		if(distance >= 0){
			
			let influence = smoothKernalThingy(SmoothingRadius, distance)
			
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
function CalculatePressureGradiant(pointIndex) {
    let pressureGrad = newVector(null, 0, 0);

   
    let particlePosPoint = particlePos[pointIndex];

    for (let k in particleArr) {
        if (k == pointIndex) {
            continue;
        }

        let particleNeighbor = particleArr[k];
        let particlePosNeighbor = particlePos[k];

        let dist = distanceCalc(particlePosPoint.x, particlePosPoint.y, particlePosNeighbor.x, particlePosNeighbor.y);

        if (dist <= SmoothingRadius) { // Ensure the particle is within the smoothing radius.
			let dir = dist === 0 ? RandDirection() : VectorSubtractWith_S_Multipler(particlePosPoint, particlePosNeighbor, 1 / dist);
        	let slope = smoothKernalDerv(particleNeighbor.SmoothingRadius, dist);
        	let density = particleNeighbor.Density;
			
       	 	let pressureForce = VectorScalarMultp(dir, -convertDensity(density) * slope * (Mass / density));
       	 	pressureGrad = VectorAddWith_S_Multiplier(pressureGrad, pressureForce, 1);
        	
        }
    }
    return pressureGrad;
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
function VectorDot(vec1, vec2){
	return vec1.x*vec2.x + vec1.y*vec2.y
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