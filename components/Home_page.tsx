import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import h from "../styles/Home.module.css";
import Drone from './Drone';
import { useNavigate } from 'react-router-dom';
import Router from "next/router";

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
  const [promo, setProm] = useState<number>(0);

  useEffect(()=>{
    if(promo === 1){
      setTimeout(() => {
        Router.push('https://www.amazon.com/s?k=gaming+headsets&pd_rd_r=983556e0-934d-4949-917c-7693d80294ea&pd_rd_w=PtdXk&pd_rd_wg=5I3em&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=F1GA6VA748YKB95Y1GEJ&ref=pd_gw_unk');
      }, 500);
    }
    else if (promo === 2){
      setTimeout(() => {
        Router.push('https://www.hepsiburada.com/');
      }, 500);

    }
    else if (promo === 3){
      setTimeout(() => {
        Router.push('https://www.ingilizceankara.com/');
      }, 500);
    }
  })

    return ( 
        <div className={h.home}>
          <div className={h.home_menu}> 
            <button style={{backgroundColor:promo === 2 ? "darkorange" : "black"}}>One</button>
            <button style={{backgroundColor:promo === 1 ? "darkorange" : "black"}}>Two</button>
            <button style={{backgroundColor:promo === 3 ? "darkorange" : "black"}}>Three</button>
          </div>
            <Canvas>
                <CameraController/>
                <Drone promo= {promo} setProm={setProm}/>
            </Canvas>
        </div>
     );
}
 
export default Home_page;

