<script setup>
defineProps({
  name: { type: String, required: true },
  role: { type: String, default: '主講人' },
  color: { type: String, default: 'blue' } // blue, amber, teal, red, purple
})

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-blue-500/10',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-amber-500/10',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 shadow-teal-500/10',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 shadow-red-500/10',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shadow-purple-500/10'
}

const dotMap = {
  blue: 'bg-blue-500 animate-pulse',
  amber: 'bg-amber-500 animate-pulse',
  teal: 'bg-teal-500 animate-pulse',
  red: 'bg-red-500 animate-pulse',
  purple: 'bg-purple-500 animate-pulse'
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm transition-all duration-200"
    :class="colorMap[color] || colorMap.blue"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotMap[color] || dotMap.blue" />
    <span class="opacity-75 tracking-wider">{{ role }}：</span>
    <span class="font-bold tracking-wide">{{ name }}</span>
  </div>
</template>
