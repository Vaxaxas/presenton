<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref(null)
let scene, camera, renderer, animationFrameId, pointsMesh

onMounted(() => {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth || window.innerWidth
  const height = canvasContainer.value.clientHeight || window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 80

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // Particle System
  const particleCount = 140
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const velocities = []

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 160
    positions[i + 1] = (Math.random() - 0.5) * 100
    positions[i + 2] = (Math.random() - 0.5) * 60

    velocities.push({
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.02
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x38bdf8, // Sky cyan accent
    size: 2.2,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  })

  pointsMesh = new THREE.Points(geometry, material)
  scene.add(pointsMesh)

  let mouseX = 0
  let mouseY = 0
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 15
    mouseY = (e.clientY / window.innerHeight - 0.5) * 15
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    // Gentle rotation & mouse parallax
    pointsMesh.rotation.y += 0.001
    pointsMesh.rotation.x += 0.0005

    camera.position.x += (mouseX - camera.position.x) * 0.02
    camera.position.y += (-mouseY - camera.position.y) * 0.02
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }
  animate()

  const onResize = () => {
    if (!canvasContainer.value) return
    const w = canvasContainer.value.clientWidth
    const h = canvasContainer.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    renderer?.dispose()
    geometry?.dispose()
    material?.dispose()
  })
})
</script>

<template>
  <div
    ref="canvasContainer"
    class="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50 dark:opacity-40"
  />
</template>
