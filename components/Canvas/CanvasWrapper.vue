<template lang="pug">
canvas(ref="canvas" class='absolute' :style='style')
  slot

</template>
<script>
export default {
  computed: {
    style() {
      return {
        width: useCommonStore().mainWindow.width + "px",
        height: useCommonStore().mainWindow.height + "px",
      };
    },
  },
  mounted() {
    useCanvasStore().context = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.width = useCanvasStore().width;
    this.$refs.canvas.height = useCanvasStore().height;
  },
};
</script>
