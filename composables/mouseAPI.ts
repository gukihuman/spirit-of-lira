export function mouseListener() {
  addEventListener("mousemove", (event) => {
    mouseStore().x = event.clientX;
    mouseStore().y = event.clientY;
  });
}
