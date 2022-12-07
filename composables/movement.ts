export function movement() {
  let deadZone = settingsStore().gamepadDeadZone;
  let axes = gamepadStore().axesStatus;
  let speed = entityStore().entities[0].speed;
  let mapOffset = commonStore().mapOffset;
  let framerate = settingsStore().framerate;
  let hero = entityStore().entities.find((i) => i.id == 0);

  let moved = false;

  // LS x
  if (axes[0] <= -1 * deadZone || axes[0] >= deadZone) {
    let changeX = (speed / framerate) * axes[0] * scale();
    hero.X += Number((changeX / scale()).toFixed(2));
    hero.state = "walk";
    hero.animState = "walk";
    moved = true;
    if (axes[0] <= 0) {
      console.log("+");
      hero.mirrored = true;
    } else {
      console.log("-");
      hero.mirrored = false;
    }
    // if (axes[0] <= -0.5 || axes[0] >= 0.5) {
    //   hero.state = "run";
    //   hero.animState = "run";
    // }
  }

  // LS y
  if (axes[1] <= -1 * deadZone || axes[1] >= deadZone) {
    let changeY = (speed / framerate) * axes[1] * scale();
    hero.Y += Number((changeY / scale()).toFixed(2));
    hero.state = "walk";
    hero.animState = "walk";
    moved = true;
    // if (axes[1] <= -0.5 || axes[1] >= 0.5) {
    //   hero.state = "run";
    //   hero.animState = "run";
    // }
  }

  if (!moved) {
    hero.animState = "idle";
    hero.state = "idle";
  }

  mapOffset[0] = (hero.X - 960) * scale();
  mapOffset[1] = (hero.Y - 540) * scale();
}
