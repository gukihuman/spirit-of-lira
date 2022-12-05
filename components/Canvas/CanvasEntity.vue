<script>
import { sources } from "@/composables/imports/webp";

export default {
  props: [
    "breed",
    "animState",
    "stateStartFrame",
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
    const i = getAnimFrameIndex(this.stateStartFrame, gameFrame, framerate);
    const c = canvasStore().context;

    // draw range circles
    if (commonStore().uiStates.ranges) {
      const offset = settingsStore().canvasPhysicOffset;
      c.save();
      c.globalAlpha = 0.2;

      c.beginPath();
      c.arc(
        this.x,
        this.y + breed.height * offset,
        this.range[0],
        0,
        2 * Math.PI
      );
      c.closePath();
      c.fillStyle = "#ffc8dd";
      c.fill();

      c.beginPath();
      c.arc(
        this.x,
        this.y + breed.height * offset,
        this.range[1],
        0,
        2 * Math.PI
      );
      c.closePath();
      c.fillStyle = "#ccd5ae";
      c.fill();

      c.restore();
    }

    const drawArgs = [
      image,
      breed.animSet[this.animState][i].x,
      breed.animSet[this.animState][i].y,
      breed.width,
      breed.height,
      this.x - breed.width / 2,
      this.y - breed.height / 2,
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
