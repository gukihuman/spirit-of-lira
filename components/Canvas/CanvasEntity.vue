<script>
import { sources } from "@/composables/imports/webp";

export default {
  props: [
    "breed",
    "animState",
    "animStateStartFrame",
    "x",
    "y",
    "mirrored",
    "range",
  ],
  render() {
    const gameFrame = commonStore().gameFrame;
    const image = new Image();
    image.src = sources[this.breed];
    const breed = animStore().breeds[this.breed];
    const framerate = breed.animSet[this.animState].length;
    const offset = settingsStore().canvasPhysicOffset;
    const i = getAnimFrameIndex(this.animStateStartFrame, gameFrame, framerate);
    const c = canvasStore().context;

    const drawArgs = [
      image,
      breed.animSet[this.animState][i].x,
      breed.animSet[this.animState][i].y,
      breed.width,
      breed.height,
      this.x - breed.width / 2,
      this.y - breed.height / 2 - breed.height * offset,
      breed.width,
      breed.height,
    ];
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
