import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Torus, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AnimatedTorii() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (group1.current) {
      group1.current.rotation.x = time * 0.3;
      group1.current.rotation.y = time * 0.2;
    }

    if (group2.current) {
      group2.current.rotation.y = time * 0.4;
      group2.current.rotation.z = -time * 0.2;
    }

    if (group3.current) {
      group3.current.rotation.x = -time * 0.2;
      group3.current.rotation.y = time * 0.5;
    }
  });

  return (
    <>
      <group ref={group1}>
        <Torus args={[1, 0.3, 16, 100]} position={[-1.5, 0, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" wireframe />
        </Torus>
      </group>

      <group ref={group2}>
        <Torus args={[1.2, 0.3, 16, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" wireframe />
        </Torus>
      </group>

      <group ref={group3}>
        <Torus args={[1, 0.3, 16, 100]} position={[1.5, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" wireframe />
        </Torus>
      </group>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
    </>
  );
}

export function AnimatedTorii3D() {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <AnimatedTorii />
        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </Suspense>
  );
}
