import { useEffect, useState } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Shape } from "three";
import { Color } from "three";

type svg_shape = {
    shape:Shape;
    color:Color;
}

const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };

const Drone = () => {
    const [shapes, setShapes] = useState<svg_shape[]>([]);
    const [excluded,setExcluded] = useState<number[]>([]);

    useEffect(() => {
        const loader = new SVGLoader();
        loader.load("/p2.svg", function(data){
            const newShapes = data.paths.map((shp) => ({shape:SVGLoader.createShapes(shp)[0],color:shp.color }));
            setShapes(newShapes);
        });
    }, []);
    
    return ( 
        <>
            <mesh>
                <boxGeometry args={[0.2,0.2,0.2]}/>
                <meshBasicMaterial color={"black"}/>
            </mesh> 
            {shapes.map((s,i) => !excluded.includes(i) &&
                <mesh key={i} scale={0.005} onClick={()=> setExcluded([...excluded, i])}>
                    <extrudeGeometry args={[s.shape,extrudeSettings]} />
                    <meshBasicMaterial color={s.color}/>
                </mesh>
            )}
        </>
     );
}
 
export default Drone;
