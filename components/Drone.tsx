import { KeyboardEvent, ReactEventHandler, useEffect, useRef, useState } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Group, InstancedMesh, Shape, Vector3 } from "three";
import { Color } from "three";
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RepeatWrapping } from 'three'

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
const max_forward_angle = -2;
const max_backward_angle = -0.8

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

    let arrowUpPressed = false;
    let arrowRightPressed = false;

    useEffect(()=> {
        const handleKeyDown = (event:any) => {
            if (event.code === 'ArrowUp') {
                arrowUpPressed = true;
              } else if (event.code === 'ArrowRight') {
                arrowRightPressed = true;
              }
            if (arrowUpPressed && arrowRightPressed) {
                console.log("double keys pressed");
              }

            if(event.key === "ArrowUp"){
                if(drone_rotationFB > max_forward_angle)
                {
                    setRot_FB(drone_rotationFB-angle_change)
                }
                else{return null}
            }
            if(event.key === "ArrowDown"){
                if(drone_rotationFB < max_backward_angle)
                {
                    setRot_FB(drone_rotationFB+angle_change)
                }
                else{return null}
            }
            if(event.key === "ArrowRight"){
                if(drone_rotationRL < 0.5){
                    setRot_RL(drone_rotationRL+angle_change)
                }
                else{return null}
            }
            if(event.key === "ArrowLeft"){
                if(drone_rotationRL > -0.5){
                    setRot_RL(drone_rotationRL-angle_change)
                }
                else{return null}
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });
    
    
    const [drone_rotationFB, setRot_FB] = useState<number>(-1.4)
    const [drone_rotationRL, setRot_RL] = useState<number>(0)
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
        <group rotation={[drone_rotationFB,drone_rotationRL,0]}>
            {/* center anchor */}
            <mesh>
                <boxGeometry args={[0.2,0.2,2]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh> 

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