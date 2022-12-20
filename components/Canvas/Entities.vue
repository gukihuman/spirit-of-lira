<script>
import { webp } from "@/composables/imports/webp"

export default {
  props: ["name", "status", "statusFrame", "x", "y", "mirrored"],
  render() {
    if (!this.name) return
    const image = new Image()
    image.src = webp[this.name]
    const visualOffsetY = 0.31
    const i = getAnimFrameIndex(
      this.statusFrame,
      Frame().current,
      Visual()[this.name].statusSet[this.status].length
    )
    const c = Canvas().context

    const drawArgs = [
      image,
      Visual()[this.name].statusSet[this.status][i].x,
      Visual()[this.name].statusSet[this.status][i].y,
      Visual()[this.name].width,
      Visual()[this.name].height,
      this.x - Visual()[this.name].width / 2 - Map().offset[0],
      this.y -
        Visual()[this.name].height / 2 -
        Visual()[this.name].height * visualOffsetY -
        Map().offset[1],
      Visual()[this.name].width,
      Visual()[this.name].height,
    ]
    if (!this.mirrored) {
      c.drawImage(...drawArgs)
    } else {
      drawArgs[5] = drawArgs[5] * -1 - Visual()[this.name].width
      c.save()
      c.scale(-1, 1)
      c.drawImage(...drawArgs)
      c.restore()
    }
  },
}
</script>
