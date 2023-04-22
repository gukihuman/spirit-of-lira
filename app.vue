<template lang="pug">

//- 1920 / 1080 centered game window
game-window

  //- 1920 / 1080 pixi viewport, where the actual game is
  viewport

  //- loading screen on top of everything
  transition(name="fast")
    loading(v-if="!gsd.states.assetsLoaded")

</template>

<script setup>
//
onMounted(() => {
  //
  startup()

  // oldStartup()
})

async function startup() {
  //
  // initialize order is important, these are independent ones
  gpm.initialize(gsd.refs.viewport) // pixi manager
  gic.initialize(gsd.refs.viewport) // input controller

  // these depend on gpm ticker, have to be initialized after gpm
  gsd.initialize() // system data
  gim.initialize() // input manager
  gcache.initialize()
  gflip.initialize() // flip containers horizontally

  // these also depend on gpm, load assets
  await gef.instanceEntity("hero")

  // this one depend on hero instance
  await gmm.initialize() // map manager

  gsd.states.assetsLoaded = true
}

// 📜 old startup
async function oldStartup() {
  //
  // devAccess
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"
  if (useCookie("name").value == "guki") States().devAccess = true

  input.initialize()

  let handleUser = Remote.fetchUserData()
  if (!useCookie("name").value) handleUser = Remote.createUser()

  await Promise.all([Remote.fetchCollision(), pixi.initialize(), handleUser])

  States().allLoaded = true
}
</script>

<style>
/* 
/* "fast" transition */
.fast-enter-active,
.fast-leave-active {
  transition: opacity 0.5s ease;
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
