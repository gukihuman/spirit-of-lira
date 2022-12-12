<template lang="pug">
div(class='bg-gray w-6 h-6 absolute')

</template>
<script setup>
const style = computed(() => {
  if (mapStore().collision[1]) {
    if (mapStore().collision[1][0]) {
      return {
        background: "red",
      };
    }
  }
});
</script>
