import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AnimatedGrid() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
      groupRef.current.position.y = Math.sin(time * 0.3) * 0.3;
    }
  });

  const cubes = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    x: (i % 3) * 1.2 - 1.2,
    y: Math.floor(i / 3) * 1.2 - 1.2,
    z: 0,
  }));

  return (
    <>
      <group ref={groupRef}>
        {cubes.map((cube) => (
          <Box key={cube.id} args={[0.8, 0.8, 0.8]} position={[cube.x, cube.y, cube.z]}>
            <meshStandardMaterial
              color={`hsl(${(cube.id * 40) % 360}, 70%, 50%)`}
              emissive={`hsl(${(cube.id * 40) % 360}, 70%, 40%)`}
              wireframe
            />
          </Box>
        ))}
      </group>

      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
    </>
  );
}

export function AnimatedGrid3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <AnimatedGrid />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
