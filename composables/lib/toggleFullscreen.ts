export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    Common().refs.background.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}
