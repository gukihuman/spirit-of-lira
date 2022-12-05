export function movement() {
  let deadZone = settingsStore().gamepadDeadZone;
  let axes = gamepadStore().axesStatus;
  let speed = entityStore().entities[0].speed;
  let mapOffset = commonStore().mapOffset;
  let framerate = settingsStore().framerate;

  // LS x
  if (axes[0] <= -1 * deadZone || axes[0] >= deadZone) {
    mapOffset[0] += (speed / framerate) * axes[0];
  }

  // LS y
  if (axes[1] <= -1 * deadZone || axes[1] >= deadZone) {
    mapOffset[1] += (speed / framerate) * axes[1];
  }
}
