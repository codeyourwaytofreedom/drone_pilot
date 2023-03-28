import { useEffect, useRef, useState } from 'react';
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

const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };
const extrudeSettings_Body = { depth: 25, bevelEnabled: true, bevelSegments: 9, steps: 9, bevelSize: 1, bevelThickness: 5 };

const full_circle = 3.141;
const rotation_speed = 0.15;
const propeller_scale = 0.005;
const body_scale = 0.025;
const propeller_pos = Math.PI/1.7;
const center_color = "magenta";



const ufoShape =  new THREE.Shape()
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

    const [shapes, setShapes] = useState<svg_shape[]>([]);
    const[body,setBody] = useState<svg_shape[]>([]);
    const [excluded,setExcluded] = useState<number[]>([0,3]);
    const propeller1 = useRef<Group>(null);
    const propeller2 = useRef<Group>(null);
    const propeller3 = useRef<Group>(null);
    const propeller4 = useRef<Group>(null);

    const texture = useLoader(TextureLoader, '/cam.jpg');
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(0.01,0.01)
/*     useFrame(()=>{
        if(propeller1.current){
            propeller1.current.rotation.z -= rotation_speed;
        }
        if(propeller3.current){
            propeller3.current.rotation.z -= rotation_speed;
        }
        if(propeller2.current){
            propeller2.current.rotation.z += rotation_speed;
        }
        if(propeller4.current){
            propeller4.current.rotation.z += rotation_speed;
        }
    }) */

    return ( 
        <>
            {/* center anchor */}
            <mesh>
                <boxGeometry args={[0.2,0.2,2]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh> 



            <mesh>
                <boxGeometry args={[0.7,1,2]}/>
                <meshBasicMaterial color={"navy"}/>
            </mesh>


            <group rotation={[0,0,full_circle/2]} position={[0,0,-0.5]}>
            <mesh scale={new Vector3(body_scale,body_scale*1.5,body_scale)} position={[-1.3,-0.70,-0.5]}>
                <extrudeGeometry args={[ufoShape,extrudeSettings_Body]}/>
                <meshBasicMaterial color={"gray"} map={texture}/>
            </mesh> 
            </group>




            {/* propellers */}
            <group ref={propeller1} position={[-2,2,0]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

            <group ref={propeller3} position={[2,-2,0]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

            <group ref={propeller2} position={[2,2,0]} rotation={[0,0,-propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"yellow"}/>
                </mesh>  */}
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

            <group ref={propeller4} position={[-2,-2,0]} rotation={[0,0,-propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"yellow"}/>
                </mesh>  */}
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : i===2 ? center_color : s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

        </>
     );
}
 
export default Drone;
