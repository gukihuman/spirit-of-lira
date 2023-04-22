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
  // initialize order is important
  gpm.initialize(gsd.refs.viewport) // pixi manager - independent
  gic.initialize(gsd.refs.viewport) // input controller - independent

  gsd.initialize() // system data - uses gpm ticker
  gim.initialize() // input manager - uses gpm ticker & gud settings

  // load assets - uses gpm
  await gef.instanceEntity("hero")
  await gmm.initialize() // map manager - uses hero instance
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
