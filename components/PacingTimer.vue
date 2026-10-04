<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="fixed bottom-3 right-5 z-40 flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-900/60 dark:bg-slate-950/80 border border-slate-700/50 backdrop-blur-md text-[11px] text-slate-300 font-mono shadow-lg select-none">
    <span class="flex items-center gap-1 text-emerald-400 font-bold">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      ⏱️ {{ formatTime(seconds) }}
    </span>
    <span class="text-slate-600">|</span>
    <span class="text-blue-400 font-semibold tracking-wider">第 3 組 專題報告</span>
  </div>
</template>
