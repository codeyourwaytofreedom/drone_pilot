import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Shape } from "three";
import { Color } from "three";


type svg_shape = {
    shape:Shape;
    color:Color;
}
let shapes:svg_shape[] =[];

const loader = new SVGLoader();
loader.load("propeller.svg", function(data){
    data.paths.map((shp) => shapes.push({shape:SVGLoader.createShapes(shp)[0],color:shp.color }))
})

const extrudeSettings = { depth: 70, bevelEnabled: true, bevelSegments: 9, steps: 2, bevelSize: 1, bevelThickness: 1 };

const Drone = () => {
    return ( 
        <>
        <mesh>
            <boxGeometry args={[0.2,0.2,0.2]}/>
            <meshBasicMaterial color={"black"}/>
        </mesh> 
        <mesh scale={0.002}>
            <extrudeGeometry args={[shapes[0].shape,extrudeSettings]} />
            <meshBasicMaterial color={"red"}/>
        </mesh>
        </>
     );
}
 
export default Drone;