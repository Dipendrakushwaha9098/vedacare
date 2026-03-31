import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AnimatedCubes() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (group1.current) {
      group1.current.rotation.x = time * 0.3;
      group1.current.rotation.y = time * 0.4;
      group1.current.position.x = Math.sin(time * 0.4) * 2;
    }

    if (group2.current) {
      group2.current.rotation.y = -time * 0.3;
      group2.current.rotation.z = time * 0.2;
      group2.current.position.y = Math.cos(time * 0.5) * 1.5;
    }

    if (group3.current) {
      group3.current.rotation.x = time * 0.2;
      group3.current.rotation.y = time * 0.35;
      group3.current.position.z = Math.sin(time * 0.6) * 1.5;
    }
  });

  return (
    <>
      <group ref={group1}>
        <Box args={[1, 1, 1]} position={[-2.5, 0, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" wireframe />
        </Box>
      </group>

      <group ref={group2}>
        <Box args={[1.2, 1.2, 1.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" wireframe />
        </Box>
      </group>

      <group ref={group3}>
        <Box args={[0.9, 0.9, 0.9]} position={[2.5, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" wireframe />
        </Box>
      </group>

      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#10b981" />
    </>
  );
}

export function AnimatedCubes3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <AnimatedCubes />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.5}
        enableZoom={false}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
