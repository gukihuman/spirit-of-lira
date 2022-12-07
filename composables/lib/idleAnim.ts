export function idleAnim() {
  let hero = entityStore().entities.find((i) => i.id == 0);
  let gameFrame = commonStore().gameFrame;
  let framerate = settingsStore().framerate;
  let switchFrames = animStore().switchFrames;

  if (
    hero.animState != "idle" &&
    hero.animState != "idleB" &&
    hero.animState != "switchIdleIdleB" &&
    hero.animState != "switchIdleBIdle"
  ) {
    hero.animState = "idle";
  }

  if (gameFrame == switchFrames.idleIdleB) {
    hero.animStateStartFrame = gameFrame;
    hero.animState = "idleB";
  }
  if (
    gameFrame % framerate == 0 &&
    Math.random() < 0.25 &&
    hero.state == "idle" &&
    hero.animState === "idle" &&
    gameFrame >= hero.animStateStartFrame + framerate * 2
  ) {
    hero.animState = "switchIdleIdleB";
    hero.animStateStartFrame = gameFrame;
    switchFrames.idleIdleB = gameFrame + framerate;
  }

  if (gameFrame == switchFrames.idleBIdle) {
    hero.animStateStartFrame = gameFrame;
    hero.animState = "idle";
  }
  if (
    gameFrame % framerate == 0 &&
    Math.random() < 0.25 &&
    hero.state == "idle" &&
    hero.animState === "idleB" &&
    gameFrame >= hero.animStateStartFrame + framerate * 2
  ) {
    hero.animState = "switchIdleBIdle";
    hero.animStateStartFrame = gameFrame;
    switchFrames.idleBIdle = gameFrame + framerate;
  }
}
