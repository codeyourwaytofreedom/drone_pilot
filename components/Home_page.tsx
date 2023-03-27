import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import h from "../styles/Home.module.css";
import Drone from './Drone';

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
      () => {
        const controls = new OrbitControls(camera, gl.domElement);
/*         controls.minDistance = 3;
        controls.maxDistance = 20; */
        return () => {
          controls.dispose();
        };
      },
      [camera, gl]
    );
    return null;
  };


const Home_page = () => {
    return ( 
        <div className={h.home}>
            <Canvas>
                <CameraController/>
                <Drone/>
            </Canvas>
        </div>
     );
}
 
export default Home_page;

