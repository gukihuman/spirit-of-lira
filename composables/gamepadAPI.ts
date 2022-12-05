export function gamepadListeners() {
  addEventListener("gamepadconnected", () => {
    gamepadStore().connected = true;
  });
  addEventListener("gamepaddisconnected", () => {
    gamepadStore().connected = false;
  });
}
export function gamepadUpdate() {
  if (gamepadStore().connected) {
    const gamepadRaw = navigator.getGamepads()[0] || {};
    const pressed = [];
    gamepadRaw.buttons.forEach((button, index) => {
      if (button.pressed) {
        pressed.push(gamepadStore().buttons[index]);
      }
    });
    const axes = [];
    gamepadRaw.axes.forEach((axis) => {
      axes.push(axis.toFixed(2));
    });
    gamepadStore().axesStatus = axes;
    gamepadStore().buttonsStatus = pressed;
  }
}
