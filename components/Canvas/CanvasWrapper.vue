<template lang="pug">
canvas(ref="canvas" class='absolute w-full h-full')
  slot

</template>
<script>
export default {
  mounted() {
    let width = 1920;
    let height = 1080;
    canvasStore().context = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.width = width;
    this.$refs.canvas.height = height;
    canvasStore().width = width;
    canvasStore().height = height;
  },
};
</script>
