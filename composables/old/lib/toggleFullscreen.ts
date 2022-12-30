export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    Refs().background.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}
