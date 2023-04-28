<template lang="pug">

//- 1920 / 1080 centered game window
game-window

  //- 1920 / 1080 pixi viewport, where the actual game is
  viewport

  transition(name="fast")
    inventory(v-if="gsd.states.context === 'inventory'")

  //- loading screen on top of everything
  transition(name="fast")
    loading(v-if="!gsd.states.assetsLoaded")

</template>

<script setup>
//
onMounted(() => {
  //
  startup()
})

async function startup() {
  //
  // initialize order is important, these are independent ones
  gpm.initialize(gsd.refs.viewport) // pixi manager
  gic.initialize(gsd.refs.viewport) // input controller

  // depend on gpm ticker, have to be initialized after gpm
  gsd.initialize() // system data
  gim.initialize() // input manager
  gcache.initialize()
  gflip.initialize() // flip containers horizontally
  gce.initialize() // collision editor
  gud.initialize() // user data

  // depend on gpm
  await gef.instanceEntity("hero")

  // depend on gpm and hero instance for its coordinates
  await gmm.initialize() // map manager

  for (let i in _.range(40)) {
    await gef.instanceEntity("bunbo")
  }

  gsd.states.assetsLoaded = true

  useCookie("name").value = useCookie("name").value || "default"
  if (useCookie("name").value == "guki") gsd.devMode = true
}
</script>

<style>
/* 
/* "fast" transition */
.fast-enter-active,
.fast-leave-active {
  transition: opacity 0.2s ease;
}

.fast-enter-from,
.fast-leave-to {
  opacity: 0;
}

/* disable scrollbar */
::-webkit-scrollbar {
  display: none;
}

/* disable text selection */
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
