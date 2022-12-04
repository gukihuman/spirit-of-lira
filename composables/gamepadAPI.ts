export function gamepadListeners() {
  addEventListener("gamepadconnected", () => {
    useGamepadStore().connected = true;
  });
  addEventListener("gamepaddisconnected", () => {
    useGamepadStore().connected = false;
  });
}
export function gamepadUpdate() {
  if (useGamepadStore().connected) {
    const gamepadRaw = navigator.getGamepads()[0] || {};
    const pressed = [];
    gamepadRaw.buttons.forEach((button, index) => {
      if (button.pressed) {
        pressed.push(useGamepadStore().buttons[index]);
      }
    });
    const axes = [];
    gamepadRaw.axes.forEach((axis) => {
      axes.push(axis.toFixed(2));
    });
    useGamepadStore().axesStatus = axes;
    useGamepadStore().buttonsStatus = pressed;
  }
}
