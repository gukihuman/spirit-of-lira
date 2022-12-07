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
    const image = new Image();
    image.src = sources[this.breed];
    const c = canvasStore().context;

    // draw range circles
    if (commonStore().states.ranges) {
      c.save();
      c.globalAlpha = 0.2;

      c.beginPath();
      c.arc(this.x, Number(this.y), this.range[0], 0, 2 * Math.PI);
      c.closePath();
      c.fillStyle = "#ffc8dd";
      c.fill();

      c.beginPath();
      c.arc(this.x, Number(this.y), this.range[1], 0, 2 * Math.PI);
      c.closePath();
      c.fillStyle = "#ccd5ae";
      c.fill();

      c.restore();
    }
  },
};
</script>
