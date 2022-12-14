<template lang="pug">
canvas(ref="canvas" class='absolute w-full h-full')
  slot

</template>
<script>
export default {
  mounted() {
    let width = 1920
    let height = 1080
    Canvas().context = this.$refs.canvas.getContext("2d")
    this.$refs.canvas.width = width
    this.$refs.canvas.height = height
    Canvas().width = width
    Canvas().height = height
  },
}
</script>
