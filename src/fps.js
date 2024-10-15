import { useBox } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { usePlayerControls } from "./helpers.js";
import * as THREE from "three";

const BaseCharacter = (props) => {
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const speed = new THREE.Vector3();
  const SPEED = 5;

  const { camera } = useThree();

  const [ref, api] = useBox((index) => ({
    mass: 1,
    type: "Dynamic",

    position: [0, 0, 0],
    ...props
  }));

  const { forward, backward, left, right } = usePlayerControls();
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);

  useFrame((state) => {
    var positionx = ref.current.getWorldPosition(camera.position).x;
    var positionz = ref.current.getWorldPosition(camera.position).z;
    /*if ((Math.abs(positionx) < 4) & (Math.abs(positionz) < 8)) {
      ref.current.getWorldPosition(camera.position);
      frontVector.set(0, 0, Number(backward) - Number(forward));
      sideVector.set(Number(left) - Number(right), 0, 0);
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(camera.rotation);
      speed.fromArray(velocity.current);

      api.velocity.set(direction.x, velocity.current[1], direction.z);
      //console.log(ref.current.getWorldPosition(camera.position).y);
    }*/
    if (positionx > 3.9) {
      api.velocity.set(-3, 0, 0);
    }
    if (positionx < -3.9) {
      api.velocity.set(3, 0, 0);
    }
    if (positionz < -8) {
      api.velocity.set(0, 0, 3);
    }
    if (positionz > 8) {
      api.velocity.set(0, 0, -3);
    }
  });

  return (
    <group>
      <mesh
        castShadow
        position={[props.position.x, props.position.y, props.position.z]}
        ref={ref}
      >
        <boxGeometry args={props.args} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
    </group>
  );
};

export default BaseCharacter;
