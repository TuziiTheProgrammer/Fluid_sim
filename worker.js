

onmessage = (object)=>{

   
        let dir = dist === 0 ? RandDirection() : VectorSubtractWith_S_Multipler(particlePosPoint, particlePosNeighbor, 1 / dist);
        let slope = smoothKernalDerv(particleNeighbor.SmoothingRadius, dist);
        let density = particleNeighbor.Density;

        let pressureForce = VectorScalarMultp(dir, -convertDensity(density) * slope * (Mass / density));
        pressureGrad = VectorAddWith_S_Multiplier(pressureGrad, pressureForce, 1);
        console.log(pressureGrad)
    
}
