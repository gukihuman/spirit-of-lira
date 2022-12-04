export function resizeListener() {
  addEventListener("resize", () => {
    mainWindowUpdate();
  });
}
