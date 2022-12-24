<template lang="pug">
div(class='absolute left-[660px] w-fit text-3xl leading-8 \
  flex items-start flex-row px-2 m-2 font-mono text-white z-30 \
  rounded-md gap-2 \
  bg-gradient-to-r from-slate-500/70 to-slate-500/0')
  div(class='w-[220px] flex flex-col justify-end \
  rounded-md p-2 pt-1')
    div(class='flex justify-between mx-auto w-full' )
      div frame
      div {{ typeof frame === "number" ? frame.toFixed(1) : "..." }} 
    div(class='flex justify-between text-end mx-auto w-full' )
      div gameLoop
      div {{ typeof gameLoop === "number" ? gameLoop.toFixed(1) :  "..." }}
    div(class='flex justify-between text-end mx-auto w-full' )
      div display
      p() {{ typeof display === "number" ? display.toFixed(1) : "..." }}
    div(class='flex justify-between text-end mx-auto w-full' )
      div other
      p() {{ typeof other === "number" ? other.toFixed(1) : "..." }}

  div(class="bg-amber-800/30 rounded-md p-2 pt-1")
    div(class='text-end mx-auto' )
      p {{ frameAvg ? frameAvg.toFixed(1) : "..."}} 
    div(class='text-end mx-auto' )
      p {{ gameLoopAvg ? gameLoopAvg.toFixed(1) : "..."}} 
    div(class='text-end mx-auto' )
      p {{ displayAvg ? displayAvg.toFixed(1) : "..."}} 
    div(class='text-end mx-auto' )
      p {{ otherAvg ? otherAvg.toFixed(1) : "..."}} 
  
  div(class="bg-red-800/30 rounded-md p-2 pt-1")
    div(class='text-end mx-auto' )
      p {{ typeof getFrameMax === "number" ? getFrameMax.toFixed(1) : "..."}} 
    div(class='text-end mx-auto' )
      p {{ typeof getGameLoopMax === "number" ? getGameLoopMax.toFixed(1) : "..."}} 
    div(class='text-end mx-auto' )
      p {{ typeof getDisplayMax === "number" ? getDisplayMax.toFixed(1) : "..."}} 
    div(class='text-end mx-auto' )
      p {{ typeof getOtherMax === "number" ? getOtherMax.toFixed(1) : "..."}} 


</template>
<script setup>
// frame
let frameStatic = ref(0)
let frame = computed(() => {
  const time = Performance().endFrame - Performance().startFrame
  if (Game().frame % 60 === 0) {
    frameStatic = time
  }
  return frameStatic
})
let frameCache = reactive([])
let frameAvg = computed(() => {
  const time = Math.abs(Performance().endFrame - Performance().startFrame)
  if (Game().frame % 60 === 0) {
    time > 0 && time < 30 ? frameCache.push(time) : {}
    frameCache.length > 10 ? frameCache.shift() : {}
  }
  return sumArray(frameCache) / frameCache.length
})
let frameMax = ref(0)
let getFrameMax = computed(() => {
  if (Game().frame % 60 === 0) {
    frameMax = Math.max(...frameCache)
  }
  return frameMax != -Infinity ? frameMax : "..."
})

// gameLoop
let gameLoopStatic = ref(0)
let gameLoop = computed(() => {
  let time = Performance().endGameLoop - Performance().startGameLoop
  if (Game().frame % 60 === 0) {
    gameLoopStatic = time
  }
  return gameLoopStatic
})
let gameLoopCache = reactive([])
let gameLoopAvg = computed(() => {
  const time = Performance().endGameLoop - Performance().startGameLoop
  if (Game().frame % 60 === 0) {
    time > 0 && time < 30 ? gameLoopCache.push(time) : {}
    gameLoopCache.length > 10 ? gameLoopCache.shift() : {}
  }
  return sumArray(gameLoopCache) / gameLoopCache.length
})
let gameLoopMax = ref(0)
let getGameLoopMax = computed(() => {
  if (Game().frame % 60 === 0) {
    gameLoopMax = Math.max(...gameLoopCache)
  }
  return gameLoopMax != -Infinity ? gameLoopMax : "..."
})

// display
let displayStatic = ref(0)
let display = computed(() => {
  if (Game().frame % 60 === 0) {
    let time = Performance().display
    displayStatic = time
  }
  return displayStatic
})
let displayCache = reactive([])
let displayAvg = computed(() => {
  const time = Performance().display
  if (Game().frame % 60 === 0) {
    time > 0 && time < 30 ? displayCache.push(time) : {}
    displayCache.length > 10 ? displayCache.shift() : {}
  }
  return sumArray(displayCache) / displayCache.length
})
let displayMax = ref(0)
let getDisplayMax = computed(() => {
  if (Game().frame % 60 === 0) {
    displayMax = Math.max(...displayCache)
  }
  return displayMax != -Infinity ? displayMax : "..."
})

let other = computed(() => {
  return frame.value - gameLoop.value - display.value
})
let otherAvg = computed(() => {
  return frameAvg.value - gameLoopAvg.value - displayAvg.value
})
let getOtherMax = computed(() => {
  let result = getFrameMax.value - getGameLoopMax.value - getDisplayMax.value
  return displayMax != -Infinity && result > 0 ? result : "..."
})
</script>
