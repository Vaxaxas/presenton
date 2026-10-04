import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface PrismGeometryProps {
  scrollProgress: number;
  isLowPerformance: boolean;
}

export const PrismGeometry: React.FC<PrismGeometryProps> = ({ scrollProgress }) => {
  // Scene Refs
  const centralRibbonRef = useRef<THREE.Mesh>(null);
  const teamNodesRef = useRef<THREE.Group>(null);
  const structureFramesRef = useRef<THREE.Group>(null);
  const clayFusionRef = useRef<THREE.Group>(null);
  const androgynousPebbleRef = useRef<THREE.Mesh>(null);
  const typographicGroupRef = useRef<THREE.Group>(null);
  const cocoonShellRef = useRef<THREE.Group>(null);
  const innerHeartRef = useRef<THREE.Mesh>(null);
  const floatingSheetsRef = useRef<THREE.Group>(null);
  const epilogueDriftRef = useRef<THREE.Points>(null);

  // Total 8 scenes: 0 to 7
  const sceneProgress = scrollProgress * 7;

  // Gentle, sparse museum dust motes
  const galleryMotes = useMemo(() => {
    const count = 280;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    return positions;
  }, []);

  // Floating Parchment Manuscript Sheets (Humanities "Discourse & Text" Metaphor)
  const manuscriptSheets = useMemo(() => {
    return [
      { pos: [-3.2, 1.2, -1.8] as [number, number, number], rot: [0.2, 0.4, -0.1] as [number, number, number], scale: 1.1 },
      { pos: [3.4, -0.8, -2.2] as [number, number, number], rot: [-0.15, -0.5, 0.2] as [number, number, number], scale: 0.95 },
      { pos: [-2.6, -1.8, -1.2] as [number, number, number], rot: [0.3, -0.2, 0.15] as [number, number, number], scale: 0.85 },
      { pos: [2.8, 2.0, -1.5] as [number, number, number], rot: [-0.25, 0.35, -0.2] as [number, number, number], scale: 1.05 },
    ];
  }, []);

  // 10 Team Sculptural Ceramic River Pebbles
  const teamPebbles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 3.3;
      return {
        id: i + 1,
        position: [
          Math.cos(angle) * radius,
          (i % 2 === 0 ? 0.45 : -0.45) + Math.sin(angle) * 0.5,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        isSpeaker: [6, 7, 8].includes(i + 1),
      };
    });
  }, []);

  // Epilogue Drifting Paper Flakes / Starlight
  const epilogueFlakes = useMemo(() => {
    const count = 480;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return positions;
  }, []);

  // Frame animations
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Central Continuous Mobius Ribbon (Gender as continuous fluid spectrum)
    if (centralRibbonRef.current) {
      centralRibbonRef.current.rotation.x = time * 0.14;
      centralRibbonRef.current.rotation.y = time * 0.22;
      centralRibbonRef.current.rotation.z = Math.sin(time * 0.1) * 0.15;

      const heroOpacity = Math.max(0, 1 - Math.abs(sceneProgress - 0));
      const structureWeight = Math.max(0, 1 - Math.abs(sceneProgress - 2));
      const scaleFactor = Math.max(0.01, 1.25 * (heroOpacity + structureWeight * 0.7));
      centralRibbonRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // 2. Floating Manuscripts Gentle Undulation
    if (floatingSheetsRef.current) {
      floatingSheetsRef.current.children.forEach((sheet, idx) => {
        sheet.position.y += Math.sin(time * 0.8 + idx * 1.5) * 0.0015;
        sheet.rotation.z += Math.cos(time * 0.5 + idx) * 0.001;
      });
    }

    // 3. Team Ceramic Pebbles (Scene 1)
    if (teamNodesRef.current) {
      teamNodesRef.current.rotation.y = time * 0.12;
      const teamAlpha = Math.max(0, 1 - Math.abs(sceneProgress - 1));
      teamNodesRef.current.position.y = THREE.MathUtils.lerp(
        teamNodesRef.current.position.y,
        (1 - teamAlpha) * 8,
        0.08
      );
    }

    // 4. Subtle Fine Brass Framing (Scene 2)
    if (structureFramesRef.current) {
      const structureAlpha = Math.max(0, 1 - Math.abs(sceneProgress - 2));
      structureFramesRef.current.rotation.y = time * 0.06;
      structureFramesRef.current.scale.setScalar(THREE.MathUtils.lerp(0.01, 1, structureAlpha));
    }

    // 5. Dual Clay Fusion into Olive Harmonious Pebble (Scene 3)
    if (clayFusionRef.current && androgynousPebbleRef.current) {
      const scene3Progress = THREE.MathUtils.clamp(sceneProgress - 2.5, 0, 1);
      const collisionDistance = THREE.MathUtils.lerp(2.2, 0, scene3Progress);

      const clayA = clayFusionRef.current.children[0];
      const clayB = clayFusionRef.current.children[1];
      if (clayA && clayB) {
        clayA.position.x = -collisionDistance;
        clayB.position.x = collisionDistance;
        const scaleVal = 1 - Math.pow(scene3Progress, 2);
        clayA.scale.setScalar(scaleVal);
        clayB.scale.setScalar(scaleVal);
      }

      const coreScale = Math.sin(scene3Progress * Math.PI) * 1.3;
      androgynousPebbleRef.current.scale.setScalar(coreScale);
      androgynousPebbleRef.current.rotation.y = time * 0.2;
      androgynousPebbleRef.current.rotation.z = Math.sin(time * 0.15) * 0.2;
    }

    // 6. Typographic Ink Stamped Plaques (Scene 4)
    if (typographicGroupRef.current) {
      const shardsAlpha = Math.max(0, 1 - Math.abs(sceneProgress - 4));
      typographicGroupRef.current.rotation.y = time * 0.12;
      typographicGroupRef.current.scale.setScalar(shardsAlpha);
    }

    // 7. Protective Organic Cocoon Shell & Beating Heart (Scene 6)
    if (cocoonShellRef.current && innerHeartRef.current) {
      const armorAlpha = Math.max(0, 1 - Math.abs(sceneProgress - 6));
      cocoonShellRef.current.rotation.y = time * 0.15;
      cocoonShellRef.current.scale.setScalar(armorAlpha);

      // Deep, gentle human heartbeat rhythm
      const pulse = Math.pow(Math.sin(time * 2.8), 4) * 0.18 + 0.88;
      innerHeartRef.current.scale.setScalar(pulse * 0.58);
    }

    // 8. Epilogue Horizon Field (Scene 7)
    if (epilogueDriftRef.current) {
      const epilogueAlpha = Math.max(0, 1 - Math.abs(sceneProgress - 7));
      epilogueDriftRef.current.rotation.y = time * 0.03;
      epilogueDriftRef.current.scale.setScalar(epilogueAlpha);
    }
  });

  return (
    <group>
      {/* =========================================================================
          Gallery Motes (Ambient Fine Dust in Daylight)
          ========================================================================= */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[galleryMotes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#A8A29E"
          transparent
          opacity={0.35}
        />
      </points>

      {/* =========================================================================
          Floating Curatorial Manuscripts (Parchment Paper Sheets)
          ========================================================================= */}
      <group ref={floatingSheetsRef}>
        {manuscriptSheets.map((sheet, idx) => (
          <Float key={idx} speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={sheet.pos} rotation={sheet.rot} scale={sheet.scale}>
              {/* Soft curved paper sheet */}
              <planeGeometry args={[1.5, 2.1, 16, 16]} />
              <meshPhysicalMaterial
                color="#F5F2ED"
                roughness={0.7}
                metalness={0.02}
                clearcoat={0.1}
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* =========================================================================
          SCENE 0 & 2: Continuous Flowing Mobius Ribbon (Henry Moore Style Sculpture)
          ========================================================================= */}
      <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={centralRibbonRef} position={[0, 0, 0]}>
          {/* Smooth, continuous Torus Knot: endless, seamless, organic ribbon */}
          <torusKnotGeometry args={[1.25, 0.32, 128, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#FAF7F2"
            roughness={0.32}
            metalness={0.04}
            transmission={0.45}
            thickness={1.4}
            ior={1.45}
            reflectivity={0.4}
            clearcoat={0.35}
            clearcoatRoughness={0.2}
            transparent
            opacity={0.94}
          />
        </mesh>
      </Float>

      {/* =========================================================================
          SCENE 1: 10 Sculptural Ceramic River Pebbles (The 10 Deconstructors)
          ========================================================================= */}
      <group ref={teamNodesRef}>
        {teamPebbles.map((pebble) => (
          <group key={pebble.id} position={pebble.position}>
            {/* Smooth flattened river stone */}
            <mesh scale={[1.2, 0.7, 1.0]}>
              <sphereGeometry args={[pebble.isSpeaker ? 0.32 : 0.22, 32, 32]} />
              <meshStandardMaterial
                color={pebble.isSpeaker ? '#C2785C' : '#E7E5E4'}
                roughness={0.55}
                metalness={pebble.isSpeaker ? 0.15 : 0.05}
              />
            </mesh>
            {/* Subtle antique brass rim for speakers */}
            {pebble.isSpeaker && (
              <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.34, 0.38, 32]} />
                <meshStandardMaterial color="#B45309" roughness={0.3} metalness={0.7} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* =========================================================================
          SCENE 2: Slender Museum Framing Wire & Fallen Bridal Ceramic Shards
          ========================================================================= */}
      <group ref={structureFramesRef} position={[0, 0, 0]}>
        {/* Four slender gallery framing rods (The 4 patriarchal structures) */}
        {[
          [-2.2, 0, -2.2],
          [2.2, 0, -2.2],
          [-2.2, 0, 2.2],
          [2.2, 0, 2.2],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 5.8, 16]} />
              <meshStandardMaterial
                color="#A8A29E"
                roughness={0.4}
                metalness={0.6}
              />
            </mesh>
          </group>
        ))}

        {/* Terracotta wedding custom tile shards at base */}
        <group position={[0, -2.4, 0]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 2.2,
                (Math.random() - 0.5) * 0.15,
                (Math.random() - 0.5) * 2.2,
              ]}
              rotation={[Math.random() * 0.3, Math.random() * 3, 0]}
            >
              <boxGeometry args={[0.42, 0.04, 0.32]} />
              <meshStandardMaterial color="#C2785C" roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Slender golden brass compass rod (Ruling No. 4 unbinding the frame) */}
        <mesh position={[0, 0, 0]} rotation={[0.45, 0.25, 0.8]}>
          <cylinderGeometry args={[0.018, 0.018, 8.5, 16]} />
          <meshStandardMaterial color="#B45309" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* =========================================================================
          SCENE 3: Dual Clay Fusion -> Olive Earth Organic Pebble (Androgynous Model)
          ========================================================================= */}
      <group position={[0, 0, 0]}>
        <group ref={clayFusionRef}>
          {/* Terracotta Clay Drop (Assertive / Traditional Mars) */}
          <mesh position={[-2, 0, 0]} scale={[1.1, 0.85, 0.95]}>
            <sphereGeometry args={[0.62, 32, 32]} />
            <meshStandardMaterial
              color="#C2785C"
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
          {/* Slate Clay Drop (Empathetic / Traditional Venus) */}
          <mesh position={[2, 0, 0]} scale={[1.1, 0.85, 0.95]}>
            <sphereGeometry args={[0.62, 32, 32]} />
            <meshStandardMaterial
              color="#475569"
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
        </group>

        {/* Harmonious Olive Earth Sculpted Pebble with Soft Hollow Void */}
        <mesh ref={androgynousPebbleRef} position={[0, 0, 0]} scale={[1.3, 0.9, 1.1]}>
          <torusGeometry args={[0.68, 0.32, 32, 64]} />
          <meshStandardMaterial
            color="#5C6E21"
            roughness={0.45}
            metalness={0.08}
          />
        </mesh>
      </group>

      {/* =========================================================================
          SCENE 4: Typographic Ink Stamp Plaques (Objectification & Chilling Effect)
          ========================================================================= */}
      <group ref={typographicGroupRef} position={[0, 0, 0]}>
        {['台女', '母豬', '女拳', '三寶'].map((word, index) => {
          const angle = (index / 4) * Math.PI * 2;
          const dist = 2.3;
          return (
            <group
              key={word}
              position={[
                Math.cos(angle) * dist,
                index % 2 === 0 ? 0.45 : -0.45,
                Math.sin(angle) * dist,
              ]}
            >
              <Text
                fontSize={0.42}
                color="#1C1917"
                anchorX="center"
                anchorY="middle"
              >
                {word}
                <meshStandardMaterial
                  color="#292524"
                  roughness={0.6}
                  metalness={0.05}
                />
              </Text>
              {/* Paper Plaque backing with subtle rounded edge */}
              <mesh position={[0, 0, -0.03]}>
                <boxGeometry args={[1.15, 0.58, 0.03]} />
                <meshStandardMaterial
                  color="#F5F2ED"
                  roughness={0.75}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* =========================================================================
          SCENE 5: Naming Power - Pure Gallery Typographic Relief
          ========================================================================= */}
      <group position={[0, 0, 0]}>
        <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.35}>
          <group position={[0, 0.35, 0]}>
            <Text
              fontSize={0.52}
              color="#1C1917"
              anchorX="center"
              anchorY="middle"
            >
              性騷擾
              <meshStandardMaterial
                color="#1C1917"
                roughness={0.3}
                metalness={0.05}
              />
            </Text>
          </group>
          <group position={[0, -0.35, 0]}>
            <Text
              fontSize={0.24}
              color="#78716C"
              anchorX="center"
              anchorY="middle"
            >
              吃豆腐 ➔ 正名法制化
              <meshStandardMaterial
                color="#78716C"
                roughness={0.5}
              />
            </Text>
          </group>
        </Float>
      </group>

      {/* =========================================================================
          SCENE 6: Organic Protective Cocoon Shell & Warm Heartbeat
          ========================================================================= */}
      <group ref={cocoonShellRef} position={[0, 0, 0]}>
        {/* Interlocking organic curved cocoon petals */}
        <mesh scale={[1.1, 1.4, 1.1]}>
          <torusGeometry args={[1.3, 0.07, 16, 64]} />
          <meshStandardMaterial
            color="#A8A29E"
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.3, 0]} scale={[1.1, 1.4, 1.1]}>
          <torusGeometry args={[1.3, 0.07, 16, 64]} />
          <meshStandardMaterial
            color="#A8A29E"
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>

        {/* Inner gentle, warm terracotta pulse (authentic vulnerable emotion) */}
        <mesh ref={innerHeartRef} scale={[1.1, 1.25, 1.1]}>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshStandardMaterial
            color="#C2785C"
            roughness={0.4}
            metalness={0.08}
          />
        </mesh>
      </group>

      {/* =========================================================================
          SCENE 7: Epilogue Dispersed Cotton Paper Flakes & Horizon Glow
          ========================================================================= */}
      <points ref={epilogueDriftRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[epilogueFlakes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.042}
          color="#A8A29E"
          transparent
          opacity={0.45}
        />
      </points>
    </group>
  );
};
