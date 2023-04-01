const Bullet = () => {
    return ( 
        <mesh position={[0,2,0]}>
            <cylinderGeometry args={[0.2,0.2,2]}/>
            <meshBasicMaterial color={"red"}/>
        </mesh> 
     );
}
 
export default Bullet;