<script>
import hero from "@/assets/anim/hero.webp";

export default {
  props: ["breed", "x", "y", "mirrored"],
  render() {
    const c = useCanvasStore().context;
    const image = new Image();
    image.src = hero;
    const breed = useAnimStore()[this.breed];

    if (!this.mirrored) {
      c.drawImage(
        image,
        breed.animSet.idle[0][0],
        breed.animSet.idle[0][1],
        breed.width,
        breed.height,
        this.x - breed.width / 2,
        this.y - breed.height / 2,
        breed.width,
        breed.height
      );
    } else {
      c.save();
      c.scale(-1, 1);
      c.drawImage(
        image,
        breed.animSet.walk[0][0],
        breed.animSet.walk[0][1],
        breed.width,
        breed.height,
        (this.x - breed.width / 2) * -1 - width,
        this.y - breed.height / 2,
        breed.width,
        breed.height
      );
      c.restore();
    }
  },
};
</script>
