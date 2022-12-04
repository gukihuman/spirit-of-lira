export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    useRefStore().background.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
