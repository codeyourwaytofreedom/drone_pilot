import { useFrame } from "@react-three/fiber";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import * as THREE from 'three';

interface rot_mov  {
    drone_positionX: number;
    drone_positionY:number;
    drone_rotationUD:number;
}


const Bullet:NextPage<rot_mov> = ({drone_positionX, drone_positionY,drone_rotationUD}) => {
    const bullet = useRef<Group>(null);
    const [triggered, setTriggered] = useState<boolean>(false);
    const [after_fire, setAfterFire] = useState({rotUD:0, rotRL:0})
    
    useEffect(()=>{
        const shoot = (e:any) => {
            if(e.which === 32)
            {
                console.log("backspace clicked")
                setTriggered(true)
                setAfterFire(
                    {rotUD:drone_rotationUD, rotRL:0}
                );
            }
        }
        window.addEventListener("keydown", shoot)
        return () => {
            window.removeEventListener("keydown",shoot)
        }
    },[])
    useFrame(()=>{
        if(bullet.current && triggered){    
            const speed = 0.05; // adjust this to control the speed of movement
            const direction = new THREE.Vector3(0, -drone_rotationUD, 0); // initial direction vector 
            const rotation = bullet.current.rotation.clone(); // get the object's rotation
            direction.applyEuler(rotation); // rotate the direction vector to match the object's rotation
            const delta = direction.multiplyScalar(speed); // calculate the movement delta
            bullet.current.position.add(delta); // update the object's position
        
        }
    })
    return ( 
        <group position={[drone_positionX,drone_positionY,0]} ref={bullet} scale={0.4} rotation={[drone_rotationUD,0,0]}>
        <mesh>
            <cylinderGeometry args={[0.2,0.2,2]}/>
            <meshBasicMaterial color={"red"}/>
        </mesh>         
        </group>
     );
}
 
export default Bullet;