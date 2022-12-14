export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    Ref().background.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}
