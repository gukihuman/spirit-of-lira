export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    refStore().background.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
