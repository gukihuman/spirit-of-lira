<script>
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
    if (!this.range) return
    const c = Canvas().context

    // draw range circles
    if (States().ranges) {
      c.save()
      c.globalAlpha = 0.2

      c.beginPath()
      c.arc(this.x, Number(this.y), this.range[0], 0, 2 * Math.PI)
      c.closePath()
      c.fillStyle = "#ffc8dd"
      c.fill()

      c.beginPath()
      c.arc(this.x, Number(this.y), this.range[1], 0, 2 * Math.PI)
      c.closePath()
      c.fillStyle = "#ccd5ae"
      c.fill()

      c.restore()
    }
  },
}
</script>
