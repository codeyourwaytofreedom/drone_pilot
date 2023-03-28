import { useEffect, useRef, useState } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Group, InstancedMesh, Shape } from "three";
import { Color } from "three";
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
import { count } from 'console';
type svg_shape = {
    shape:Shape;
    color:Color;
}

const extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };
const full_circle = 3.141;
const rotation_speed = 0.15;
const propeller_scale = 0.005;
const propeller_pos = Math.PI/1.7;
const center_color = "yellow";

const Drone = () => {
    //set the 3D object from the loader
    useEffect(() => {
        const loader = new SVGLoader();
        loader.load("/p2.svg", function(data){
            const newShapes = data.paths.map((shp) => ({shape:SVGLoader.createShapes(shp)[0],color:shp.color }));
            setShapes(newShapes);
        });
    }, []);

    const [shapes, setShapes] = useState<svg_shape[]>([]);
    const [excluded,setExcluded] = useState<number[]>([0,3]);
    const propeller1 = useRef<Group>(null);
    const propeller2 = useRef<Group>(null);
    const propeller3 = useRef<Group>(null);
    const propeller4 = useRef<Group>(null);

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
                <boxGeometry args={[0.2,0.2,0.2]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh> 

            <group ref={propeller1} position={[-2,2,0]} rotation={[0,0,propeller_pos]}>
{/*                 <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"red"}/>
                </mesh>  */}
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={propeller_scale} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={i==4 ? center_color : s.color}/>
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
                            <meshBasicMaterial color={i==4 ? center_color : s.color}/>
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
                            <meshBasicMaterial color={i==4 ? center_color : s.color}/>
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
                            <meshBasicMaterial color={i==4 ? center_color : s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

        </>
     );
}
 
export default Drone;
