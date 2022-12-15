<script>
import { webp } from "@/composables/imports/webp"

export default {
  props: ["name", "anim", "animFrame", "x", "y", "mirrored"],
  render() {
    const image = new Image()
    image.src = webp[this.name]
    const name = Visual()[this.name]
    const visualOffsetY = 0.2
    const i = getAnimFrameIndex(
      this.animFrame,
      Frame().current,
      name.animSet[this.anim].length
    )
    const c = Canvas().context

    const drawArgs = [
      image,
      name.animSet[this.anim][i].x,
      name.animSet[this.anim][i].y,
      name.width,
      name.height,
      this.x - name.width / 2,
      this.y - name.height / 2 - name.height * visualOffsetY,
      name.width,
      name.height,
    ]
    if (!this.mirrored) {
      c.drawImage(...drawArgs)
    } else {
      drawArgs[5] = drawArgs[5] * -1 - name.width
      c.save()
      c.scale(-1, 1)
      c.drawImage(...drawArgs)
      c.restore()
    }
  },
}
</script>
