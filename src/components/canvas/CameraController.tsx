import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PRESENTATION_DATA } from '../../data/slides';

interface CameraControllerProps {
  scrollProgress: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({ scrollProgress }) => {
  const { mouse } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 7));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  const waypoints = useMemo(() => {
    return PRESENTATION_DATA.sceneWaypoints.map((w) => ({
      pos: new THREE.Vector3(...w.camera.pos),
      target: new THREE.Vector3(...w.camera.target),
    }));
  }, []);

  useFrame((state, delta) => {
    const totalSegments = waypoints.length - 1;
    const progress = Math.max(0, Math.min(1, scrollProgress));
    const segment = progress * totalSegments;
    const index = Math.min(Math.floor(segment), totalSegments - 1);
    const segmentProgress = segment - index;

    // Smooth bezier or ease curve for segment progress
    const easeProgress = THREE.MathUtils.smoothstep(segmentProgress, 0, 1);

    const fromWaypoint = waypoints[index];
    const toWaypoint = waypoints[index + 1] || waypoints[index];

    // Compute interpolated camera position
    const desiredPos = new THREE.Vector3().lerpVectors(
      fromWaypoint.pos,
      toWaypoint.pos,
      easeProgress
    );

    // Compute interpolated camera lookAt target
    const desiredTarget = new THREE.Vector3().lerpVectors(
      fromWaypoint.target,
      toWaypoint.target,
      easeProgress
    );

    // Add subtle organic mouse parallax
    const parallaxX = (mouse.x * 0.3);
    const parallaxY = (mouse.y * 0.2);
    desiredPos.x += parallaxX;
    desiredPos.y += parallaxY;

    // Smooth lerp for continuous orbit
    const lerpFactor = Math.min(1, 4.0 * delta);
    currentPos.current.lerp(desiredPos, lerpFactor);
    currentTarget.current.lerp(desiredTarget, lerpFactor);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
};
