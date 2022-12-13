import { mapUpdate } from "./mapAPI";
import { isMousePositionChanged } from "./mouseAPI";
import { movement } from "./movement";

export function gameLoop() {
  setInterval(() => {
    if (!commonStore().states.pause) {
      commonStore().gameFrame++;
      gamepadUpdate();
      movement();
      animStore().idleAnim ? idleAnim() : {};
      canvasClear();
      canvasGenerate();
      commonStore().states.mapEdit ? mapEditUpdate() : {};
    }
  }, 1000 / settingsStore().framerate);
}
