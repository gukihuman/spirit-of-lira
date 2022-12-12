export function movement() {
  let deadZone = settingsStore().gamepadDeadZone;
  let axes = gamepadStore().axesStatus;
  let speed = entityStore().entities[0].speed * 10;
  let mapOffset = commonStore().mapOffset;
  let framerate = settingsStore().framerate;
  let hero = entityStore().entities.find((i) => i.id == 0);

  let moved = false;

  // LS x
  if (axes[0] <= -1 * deadZone || axes[0] >= deadZone) {
    let changeX = (speed / framerate) * axes[0];
    hero.X += Number(changeX.toFixed(2));
    hero.state = "walk";
    hero.animState = "walk";
    moved = true;
    if (axes[0] <= 0) {
      hero.mirrored = true;
    } else {
      hero.mirrored = false;
    }
    animStore().idleAnim = false;
    // if (axes[0] <= -0.5 || axes[0] >= 0.5) {
    //   hero.state = "run";
    //   hero.animState = "run";
    // }
  }

  // LS y
  if (axes[1] <= -1 * deadZone || axes[1] >= deadZone) {
    let changeY = (speed / framerate) * axes[1];
    hero.Y += Number(changeY.toFixed(2));
    hero.state = "walk";
    hero.animState = "walk";
    moved = true;
    animStore().idleAnim = false;
    // if (axes[1] <= -0.5 || axes[1] >= 0.5) {
    //   hero.state = "run";
    //   hero.animState = "run";
    // }
  }

  if (!moved) {
    hero.state = "idle";
    animStore().idleAnim = true;
  }

  mapOffset[0] = hero.X - 960;
  mapOffset[1] = hero.Y - 540;
}
