<script>
export default {
  props: ["name", "x", "y", "state", "stateFrame", "mirrored"],
  render() {
    if (!this.name) return
    const image = new Image()
    image.src = webp[this.name]
    const visualOffsetY = 0.31
    const i = getAnimFrameIndex(
      this.stateFrame,
      Game().frame,
      Visual()[this.name].stateSet[this.state].length
    )
    const c = Canvas().context

    const drawArgs = [
      image,
      Visual()[this.name].stateSet[this.state][i].x,
      Visual()[this.name].stateSet[this.state][i].y,
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
