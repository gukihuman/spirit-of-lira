<template lang="pug">
canvas(ref="canvas" class='absolute w-full h-full')
  slot

</template>
<script>
export default {
  mounted() {
    useCanvasStore().context = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.width = useCanvasStore().width;
    this.$refs.canvas.height = useCanvasStore().height;
  },
};
</script>
