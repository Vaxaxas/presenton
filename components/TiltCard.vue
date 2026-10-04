<script setup>
import { ref } from 'vue'

defineProps({
  glowColor: { type: String, default: 'rgba(56, 189, 248, 0.15)' }
})

const cardRef = ref(null)
const transformStyle = ref('')
const isHovered = ref(false)

const handleMouseMove = (e) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  const rotateX = -(y / (rect.height / 2)) * 7
  const rotateY = (x / (rect.width / 2)) * 7
  transformStyle.value = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
}

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  transformStyle.value = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
}
</script>

<template>
  <div
    ref="cardRef"
    class="tilt-card-wrapper transition-transform duration-200 ease-out will-change-transform relative rounded-xl"
    :style="{ transform: transformStyle }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      v-if="isHovered"
      class="absolute -inset-0.5 rounded-xl blur opacity-75 transition duration-300 pointer-events-none"
      :style="{ background: glowColor }"
    />
    <div class="relative h-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tilt-card-wrapper {
  transform-style: preserve-3d;
}
</style>
