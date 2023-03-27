import { useEffect, useState } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Shape } from "three";
import { Color } from "three";

type svg_shape = {
    shape:Shape;
    color:Color;
}

const extrudeSettings = { depth: 70, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };

const Drone = () => {
    const [shapes, setShapes] = useState<svg_shape[]>([]);
    
    useEffect(() => {
        const loader = new SVGLoader();
        loader.load("/propeller.svg", function(data){
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
            {shapes.map((s,i) =>
                <mesh key={i} scale={0.002}>
                    <extrudeGeometry args={[s.shape,extrudeSettings]} />
                    <meshBasicMaterial color={s.color}/>
                </mesh>
            )}
        </>
     );
}
 
export default Drone;
