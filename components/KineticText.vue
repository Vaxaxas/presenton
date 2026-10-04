<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  tag: { type: String, default: 'div' },
  delay: { type: Number, default: 0.1 },
  stagger: { type: Number, default: 0.03 }
})

const containerRef = ref(null)

onMounted(async () => {
  await nextTick()
  if (!containerRef.value) return
  
  const text = containerRef.value.innerText.trim()
  if (!text) return
  
  // Split into character spans for elastic spring entrance
  containerRef.value.innerHTML = text
    .split('')
    .map(char => {
      if (char === ' ') return '<span>&nbsp;</span>'
      return `<span class="inline-block origin-bottom transform">${char}</span>`
    })
    .join('')

  const chars = containerRef.value.querySelectorAll('span')
  gsap.fromTo(
    chars,
    {
      opacity: 0,
      y: 35,
      rotateX: -45,
      scale: 0.85
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(2)',
      stagger: props.stagger,
      delay: props.delay
    }
  )
})
</script>

<template>
  <component :is="tag" ref="containerRef" class="perspective-500 will-change-transform">
    <slot />
  </component>
</template>

<style scoped>
.perspective-500 {
  perspective: 600px;
}
</style>
