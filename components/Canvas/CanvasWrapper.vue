<template lang="pug">
canvas(ref="canvas" class='absolute w-full h-full')
  slot

</template>
<script>
export default {
  mounted() {
    Canvas().context = this.$refs.canvas.getContext("2d")
    this.$refs.canvas.width = Canvas().width
    this.$refs.canvas.height = Canvas().height
  },
}
</script>
