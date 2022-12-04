<script>
import { sources } from "@/composables/imports/webp";

export default {
  props: ["breed", "state", "stateStartFrame", "x", "y", "mirrored"],
  render() {
    const gameFrame = useCommonStore().gameFrame;
    const image = new Image();
    image.src = sources[this.breed];
    const breed = useAnimStore().breeds[this.breed];
    const framerate = breed.animSet[this.state].length;
    const i = getAnimFrameIndex(this.stateStartFrame, gameFrame, framerate);
    const drawArgs = [
      image,
      breed.animSet[this.state][i].x,
      breed.animSet[this.state][i].y,
      breed.width,
      breed.height,
      this.x - breed.width / 2,
      this.y - breed.height / 2,
      breed.width,
      breed.height,
    ];

    const c = useCanvasStore().context;
    if (!this.mirrored) {
      c.drawImage(...drawArgs);
    } else {
      drawArgs[5] = drawArgs[5] * -1 - breed.width;
      c.save();
      c.scale(-1, 1);
      c.drawImage(...drawArgs);
      c.restore();
    }
  },
};
</script>
