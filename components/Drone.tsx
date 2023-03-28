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

const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };
const full_circle = 3.141;

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
    const [excluded,setExcluded] = useState<number[]>([]);
    const propeller0 = useRef<Group>(null);
    const propeller1 = useRef<Group>(null);
    const propeller2 = useRef<Group>(null);
    const propeller3 = useRef<Group>(null);

    useFrame(()=>{
        if(propeller0.current){
            propeller0.current.rotation.z += 0.01;
        }
    })

    return ( 
        <>
            {/* center anchor */}
            <mesh>
                <boxGeometry args={[0.2,0.2,0.2]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh> 

            <group ref={propeller0} position={[-2,2,0]}>
                <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"green"}/>
                </mesh> 
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={0.005} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

            <group ref={propeller1} position={[2,-2,0]}>
                <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"green"}/>
                </mesh> 
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={0.005} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

            <group ref={propeller2} position={[-2,-2,0]}>
                <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"green"}/>
                </mesh> 
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={0.005} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={s.color}/>
                        </mesh>
                    )}
                </group>
            </group>

            <group ref={propeller3} position={[2,2,0]}>
                <mesh>
                    <boxGeometry args={[0.2,0.2,0.2]}/>
                    <meshBasicMaterial color={"green"}/>
                </mesh> 
                <group position={[-0.45,-1,0]}>
                    {shapes.map((s,i) => !excluded.includes(i) &&
                        <mesh key={i} scale={0.005} onClick={()=> setExcluded([...excluded, i])}>
                            <extrudeGeometry args={[s.shape,extrudeSettings]} />
                            <meshBasicMaterial color={s.color}/>
                        </mesh>
                    )}
                </group>
            </group>
        </>
     );
}
 
export default Drone;
