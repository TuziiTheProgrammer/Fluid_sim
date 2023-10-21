function calculateDistance(x, y){
    return Math.sqrt(x^2 + y^2)
}

function newVector( particle_ ,new_x, new_y){
	return {x:particle_.Position.x + new_x, y:particle_.Position.y + new_y}
}

let innerWidth = window.innerWidth*0.8
let innerHeight = window.innerHeight


class Particle{
    #canvas;
    #damp = 1
    #lastPos
    #RadialOffset = 1000
    #Tcanvas


    constructor(canvas_, Tcanvas){
        this.Type == "Particle"
        this.#Tcanvas = Tcanvas
        this.Position = {x: innerWidth/2, y: innerHeight/2}
        this.#canvas = canvas_
        this.TimeStep = NaN
        this.Velocity = {x: 0, y: 0}
        this.Size = 5
        this.Force = 9.8;
        this.Mass = 1;
        this.Acceleration = 3
        this.DampingRate = 0.5
        this.Density = 1
        this.Color = "blue"
        this.SmoothingRadius = 1
        this.ParticleDensityArea = 0
        this.Instanced = false
        this.ForceX = 2
        this.PressAccX = 1
        this.PressAccy = 1
        this.PressForce = {x: 0, y: 0}



        this.VelocityTable = [this.ForceX, this.Force]
       
        
        
    }


    makeParticle(){
        this.#canvas.fillStyle = this.Color
        this.Instanced = true
        this.#ParticleAttributes(this.#canvas)
    }

    #newVector(new_x, new_y){
        return {x:this.#lastPos.x + new_x, y:this.#lastPos.y + new_y}
    }

    #ParticleAttributes(_){

        _.beginPath();
	    _.arc(this.Position.x, this.Position.y, this.Size, 0, 2 * Math.PI);
	    _.fill();
	    _.stroke();
    }


    setVelocity(velocityVec){
        this.Velocity = velocityVec
    }


    getVelocity(lastPos, ignoredforces){
        this.#lastPos = lastPos
        let VelocityArr =  {
            v1:Math.floor((this.Position.x - lastPos.x)/this.TimeStep/ignoredforces),  
            v2:Math.floor((this.Position.y - lastPos.y)/this.TimeStep/ignoredforces)
        }
        this.Velocity = VelocityArr
        return VelocityArr
    }
}






