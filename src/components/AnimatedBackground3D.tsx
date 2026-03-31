import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AnimatedShapes() {
  const mesh1Ref = useRef<THREE.Group>(null);
  const mesh2Ref = useRef<THREE.Group>(null);
  const mesh3Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.x = time * 0.3;
      mesh1Ref.current.rotation.y = time * 0.4;
      mesh1Ref.current.position.y = Math.sin(time * 0.5) * 0.5;
    }

    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x = time * 0.2;
      mesh2Ref.current.rotation.y = -time * 0.3;
      mesh2Ref.current.position.z = Math.cos(time * 0.4) * 1;
    }

    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.x = -time * 0.3;
      mesh3Ref.current.rotation.y = time * 0.5;
      mesh3Ref.current.position.y = Math.cos(time * 0.6) * 0.5;
    }
  });

  return (
    <>
      {/* First animated sphere */}
      <group ref={mesh1Ref}>
        <Sphere args={[0.8, 32, 32]} position={[-2, 0, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" wireframe />
        </Sphere>
      </group>

      {/* Second animated sphere */}
      <group ref={mesh2Ref}>
        <Sphere args={[0.6, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" wireframe />
        </Sphere>
      </group>

      {/* Third animated sphere */}
      <group ref={mesh3Ref}>
        <Sphere args={[0.7, 32, 32]} position={[2, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" wireframe />
        </Sphere>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#10b981" />
    </>
  );
}

export function AnimatedBackground3D() {
  return (
    <Suspense fallback={null}>
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 75 }} 
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <AnimatedShapes />
        <OrbitControls
          autoRotate
          autoRotateSpeed={2}
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </Suspense>
  );
}
