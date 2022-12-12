import { gamepadStore } from "./../stores/generated/gamepadStore";
import { commonStore } from "./../stores/generated/commonStore";
export function mouseListener() {
  addEventListener("mousemove", (event) => {
    commonStore().states.cursor = true;
    mouseStore().x = event.clientX;
    mouseStore().y = event.clientY;
  });
}

export function isMousePositionChanged() {
  if (
    mouseStore().x == mouseStore().prevX &&
    mouseStore().y == mouseStore().prevY
  ) {
    mouseStore().prevX = mouseStore().x;
    mouseStore().prevY = mouseStore().y;
    return false;
  } else {
    mouseStore().prevX = mouseStore().x;
    mouseStore().prevY = mouseStore().y;
    return true;
  }
}

export function mouseLoop() {
  setInterval(() => {
    if (!isMousePositionChanged() && gamepadStore().connected) {
      commonStore().states.cursor = false;
    }
  }, 4000);
}
