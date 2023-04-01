import { useEffect, useRef, useState } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Group, Shape, Vector3 } from "three";
import { Color } from "three";
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RepeatWrapping } from 'three'
import { setInterval } from 'timers';
import Bullet from './bullet';

type svg_shape = {
    shape:Shape;
    color:Color;
}

const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };
const extrudeSettings_Body = { depth: 25, bevelEnabled: true, bevelSegments: 9, steps: 9, bevelSize: 1, bevelThickness: 5 };

const full_circle = 3.141;
const rotation_speed = 1;
const propeller_scale = 0.005;
const body_scale = 0.025;
const propeller_pos = Math.PI/1.7;
const center_color = "#D2691E";
const pole_color = "black";
const propeller_color = "#1E90FF"
const angle_change = 0.05;
const distance_change = 0.2;
const max_angle_UP = -2;
const min_angle_UD = -0.8;
const max_angle_RL = 1;
const min_angle_RL = -1;
const smoothness = 50;

const drone_shape =  new THREE.Shape()
    .moveTo(0, 20)
    .quadraticCurveTo(0, 0, 20, 0)
    .lineTo(80, 0)
    .quadraticCurveTo(100, 0, 100, 20)
    .quadraticCurveTo(100, 40, 80, 40)
    .lineTo(20, 40)
    .quadraticCurveTo(0, 40, 0, 20);


const Drone = () => {
    //set the 3D object from the loader
    useEffect(() => {
        const loader = new SVGLoader();
        loader.load("/p2.svg", function(data){
            const newShapes = data.paths.map((shp) => ({shape:SVGLoader.createShapes(shp)[0],color:shp.color }));
            setShapes(newShapes);
        });
        loader.load("/body.svg", function(data){
            const newShapes = data.paths.map((shp) => ({shape:SVGLoader.createShapes(shp)[0],color:shp.color }));
            setBody(newShapes);
        });
    }, []);

    const [drone_rotationUD, setRot_UD] = useState<number>(-1.4);
    const [drone_rotationRL, setRot_RL] = useState<number>(0);
    const [drone_positionX, setPositionX] = useState<number>(0);
    const [drone_positionY, setPositionY] = useState<number>(0);

    const rotUP = () => {
        let i = 0;
        const interval_rot = setInterval(() => {
            if(i>smoothness){
                clearInterval(interval_rot);
                return;
            }
            i++
            setRot_UD(prevRotationUD => prevRotationUD > max_angle_UP ? prevRotationUD - angle_change/smoothness: prevRotationUD);
        },10)
    }
    const rotRight = () => {
        let i = 0;
        const interval_rot = setInterval(() => {
            if(i>smoothness){
                clearInterval(interval_rot);
                return;
            }
            i++
            setRot_RL(prevRotationRL => prevRotationRL < max_angle_RL ? prevRotationRL + angle_change/smoothness : prevRotationRL);
        },10)
    }
    const rotLeft = () => {
        let i = 0;
        const interval_rot = setInterval(() => {
            if(i>smoothness){
                clearInterval(interval_rot);
                return;
            }
            i++
            setRot_RL(prevRotationRL => prevRotationRL > min_angle_RL ? prevRotationRL - angle_change/smoothness: prevRotationRL);
        },10)
    }
    const rotDown = () => {
        let i = 0;
        const interval_rot = setInterval(() => {
            if(i>smoothness){
                clearInterval(interval_rot);
                return;
            }
            i++
            setRot_UD(prevRotationUD => prevRotationUD < min_angle_UD ? prevRotationUD + angle_change/smoothness : prevRotationUD);
        },10)
    }
    

    const moveLeft = () => {
        let i = 0;
        const intervalId = setInterval(() => {
          if (i >= smoothness) {
            clearInterval(intervalId); 
            return;
          }
          setPositionX(prevX => prevX-distance_change/smoothness);
          i++;
        }, 10); 
    }
    const moveRight = () => {
        let i = 0;
        const intervalId = setInterval(() => {
          if (i >= smoothness) {
            clearInterval(intervalId);
            return;
          }
          setPositionX(prevX => prevX+distance_change/smoothness);
          i++;
        }, 10); 
    }
    const moveUp = () => {
        let i = 0;
        const intervalId = setInterval(() => {
          if (i >= smoothness) {
            clearInterval(intervalId);
            return;
          }
          setPositionY(prevY => prevY + distance_change/smoothness);
          i++;
        }, 10); 
    }
    const moveDown = () => {
        let i = 0;
        const intervalId = setInterval(() => {
          if (i >= smoothness) {
            clearInterval(intervalId);
            return;
          }
          setPositionY(prevY => prevY-distance_change/smoothness);
          i++;
        }, 10); 
    }
    
    
    useEffect(() => {
    // Keep track of which keys are currently pressed down
    const keysDown: { [key: string]: boolean } = {};
    const handleKeyDown = (e:any) => {
        keysDown[e.key] = true;
        // Key combinations for rotations
        const moves = () => {
            if(keysDown["w"]){
                moveUp();
            }
            if(keysDown["s"]){
                moveDown();
            }
            if(keysDown["a"]){
                moveLeft();
            }
            if(keysDown["d"]){
                moveRight();
            }
        }

        if (keysDown["ArrowUp"]) {
            rotUP();
            if(keysDown["ArrowRight"]){rotRight();}
            if(keysDown["ArrowLeft"]){rotLeft();}
            moves();
        } 
        else if (keysDown["ArrowDown"]) {
            rotDown();
            if(keysDown["ArrowRight"]){rotRight();}
            if(keysDown["ArrowLeft"]){rotLeft();}
            moves();
        } 
        else if (keysDown["ArrowRight"]) {
            rotRight();
            moves();
        } 
        else if (keysDown["ArrowLeft"]) {
            rotLeft();
            moves();
        } 
        else{
            moves()
        }
    };

    const handleKeyUp = (e:any) => {
        delete keysDown[e.key];
    };

    // Add event listeners for keydown and keyup events
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
    }, []);    
    


    const [shapes, setShapes] = useState<svg_shape[]>([]);
    const[body,setBody] = useState<svg_shape[]>([]);
    const [excluded,setExcluded] = useState<number[]>([0,3]);
    const propeller1 = useRef<Group>(null);
    const propeller2 = useRef<Group>(null);
    const propeller3 = useRef<Group>(null);
    const propeller4 = useRef<Group>(null);

    const texture = useLoader(TextureLoader, '/cam1.jpg');
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(0.01,0.01)

    const p = useLoader(TextureLoader, "cam1.jpg");
    p.wrapT = RepeatWrapping;
    p.wrapS = RepeatWrapping;
    p.repeat.set(0.3,0.3)

/*     useFrame(()=>{
        if(propeller1.current){
            propeller1.current.rotation.z -= rotation_speed;
        }        
        if(propeller4.current){
            propeller4.current.rotation.z -= rotation_speed;
        }

        if(propeller3.current){
            propeller3.current.rotation.z += rotation_speed;
        }
        if(propeller2.current){
            propeller2.current.rotation.z += rotation_speed;
        }
    }) */

    return ( 
        <>
        <Bullet drone_positionX={drone_positionX} drone_positionY={drone_positionY} drone_rotationUD={drone_rotationUD} />
        <group rotation={[drone_rotationUD,drone_rotationRL,0]} position={[drone_positionX,drone_positionY,0]} scale={0.3}>
            {/* center anchor */}
{/*             <mesh>
                <boxGeometry args={[0.2,0.2,2]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh>  */}
            
            {/* full axis one */}
            <group position={[0,0,-0.6]} rotation={[0,0,0.8]}>
                {/* axis */}
                <mesh rotation={[0,1.55,0]}>
                    <boxGeometry args={[0.3,0.3,6.5]}/>
                    <meshBasicMaterial color={"black"}/>
                </mesh> 
                
                {/* pole */}
                <mesh position={[-3.3,0,-0.06]}>
                    <boxGeometry args={[0.3,1,0.3]}/>
                    <meshBasicMaterial color={"black"}/>
                </mesh> 
                <mesh position={[-3.3,0,-0.06]}>
                    <cylinderGeometry args={[0.3,0.3,0.35]}/>
                    <meshBasicMaterial color={"gray"} map={p}/>
                </mesh> 
                
                {/* pole */}
                <mesh position={[3.3,0,0.06]}>
                    <boxGeometry args={[0.5,1,0.3]}/>
                    <meshBasicMaterial color={"black"}/>
                </mesh> 
                <mesh position={[3.3,0,0.06]}>
                    <cylinderGeometry args={[0.3,0.3,0.3]}/>
                    <meshBasicMaterial color={"gray"} map={p}/>
                </mesh> 

                {/* propeller holder */}
                <mesh position={[-3.3,0,0.4]} rotation={[full_circle/2,0,0]}>
                    <cylinderGeometry args={[0.05,0.1,0.7]} />
                    <meshBasicMaterial color={pole_color} />
                </mesh>
                <mesh position={[3.3,0,0.4]} rotation={[full_circle/2,0,0]}>
                    <cylinderGeometry args={[0.05,0.1,0.7]} />
                    <meshBasicMaterial color={pole_color} />
                </mesh>
            </group>

            {/* full axis two */}
            <group position={[0,0,-0.6]} rotation={[0,0,-0.8]}>
                {/* axis */}
                <mesh rotation={[0,1.55,0]}>
                    <boxGeometry args={[0.3,0.3,6.5]}/>
                    <meshBasicMaterial color={"black"}/>
                </mesh> 
                
                {/* pole */}
                <mesh position={[-3.3,0,-0.06]}>
                    <boxGeometry args={[0.3,1,0.3]}/>
                    <meshBasicMaterial color={"black"}/>
                </mesh> 
                <mesh position={[-3.3,0,-0.06]}>
                    <cylinderGeometry args={[0.3,0.3,0.35]}/>
                    <meshBasicMaterial color={"gray"} map={p}/>
                </mesh> 
                
                {/* pole */}
                <mesh position={[3.3,0,0.06]}>
                    <boxGeometry args={[0.5,1,0.3]}/>
                    <meshBasicMaterial color={"black"}/>
                </mesh> 
                <mesh position={[3.3,0,0.06]}>
                    <cylinderGeometry args={[0.3,0.3,0.3]}/>
                    <meshBasicMaterial color={"gray"} map={p}/>
                </mesh> 

                {/* propeller holder */}
                <mesh position={[-3.3,0,0.4]} rotation={[full_circle/2,0,0]}>
                    <cylinderGeometry args={[0.05,0.1,0.7]} />
                    <meshBasicMaterial color={pole_color} />
                </mesh>
                <mesh position={[3.3,0,0.4]} rotation={[full_circle/2,0,0]}>
                    <cylinderGeometry args={[0.05,0.1,0.7]} />
                    <meshBasicMaterial color={pole_color} />
                </mesh>
            </group>

            {/* drone body */}
            <group rotation={[0,0,full_circle/2]} position={[0,0,-0.5]}>
                <mesh scale={new Vector3(body_scale*1.2,body_scale*1.9,body_scale)} position={[-1.45,-0.90,-0.5]}>
                    <extrudeGeometry args={[drone_shape,extrudeSettings_Body]}/>
                    <meshBasicMaterial color={"gray"} map={texture}/>
                </mesh> 
            </group>

            {/* propeller Top Left */}
            <group ref={propeller1} position={[-2.3,2.38,0.11]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.01,0.01,0.5]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-0.98,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : propeller_color}/>
                        </mesh>
                    )}
                </group>
            </group>

            {/* propeller Bottom Right */}
            <group ref={propeller4} position={[2.3,-2.36,0.11]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.01,0.01,0.5]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-0.98,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : propeller_color}/>
                        </mesh>
                    )}
                </group>
            </group>

            {/* propeller Top Right */}
            <group ref={propeller3} position={[2.3,2.38,0.11]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.01,0.01,0.5]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-0.98,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : propeller_color}/>
                        </mesh>
                    )}
                </group>
            </group>

            {/* propeller Bottom Left */}
            <group ref={propeller2} position={[-2.3,-2.36,0.11]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.01,0.01,0.5]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-0.98,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : propeller_color}/>
                        </mesh>
                    )}
                </group>
            </group>
        </group>
        </>
     );
}
 
export default Drone;