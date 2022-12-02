export function useGamepadSetup() {
  const gamepadAPI = {
    controller: {},
    turbo: false,
    connect() {},
    disconnect() {},
    update() {},
    buttonPressed() {},
    buttons: [],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: [],
  };
  gamepadAPI.buttons = [
    "DPad-Up",
    "DPad-Down",
    "DPad-Left",
    "DPad-Right",
    "Start",
    "Back",
    "Axis-Left",
    "Axis-Right",
    "LB",
    "RB",
    "Power",
    "A",
    "B",
    "X",
    "Y",
  ];
  gamepadAPI.connect = (event) => {
    gamepadAPI.controller = event.gamepad;
    gamepadAPI.turbo = true;
    console.log("Gamepad connected.");
  };
  gamepadAPI.disconnect = () => {
    gamepadAPI.turbo = false;
    delete gamepadAPI.controller;
    console.log("Gamepad disconnected.");
  };
  gamepadAPI.update = () => {
    // Clear the buttons cache
    gamepadAPI.buttonsCache = [];

    // Move the buttons status from the previous frame to the cache
    for (let k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
      gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
    }

    // Clear the buttons status
    gamepadAPI.buttonsStatus = [];

    // Get the gamepad object
    const c = navigator.getGamepads()[0] || {};

    // Loop through buttons and push the pressed ones to the array
    const pressed = [];
    if (c.buttons) {
      for (let b = 0; b < c.buttons.length; b++) {
        if (c.buttons[b].pressed) {
          pressed.push(gamepadAPI.buttons[b]);
        }
      }
    }

    // Loop through axes and push their values to the array
    const axes = [];
    if (c.axes) {
      for (let a = 0; a < c.axes.length; a++) {
        axes.push(c.axes[a].toFixed(2));
      }
    }

    // Assign received values
    gamepadAPI.axesStatus = axes;
    gamepadAPI.buttonsStatus = pressed;

    // Return buttons for debugging purposes
    return pressed;
  };
  return gamepadAPI;
}
