export function getAnimFrameIndex(stateStartFrame, currentFrame, framerate) {
  let startFrameOffset = stateStartFrame % (60 / framerate)
  let flatStateStartFrame = stateStartFrame - startFrameOffset
  let flatGameFrame = currentFrame - startFrameOffset
  let startAnimFrame =
    Math.floor(flatStateStartFrame / (60 / framerate)) % framerate
  let currentAnimFrame =
    Math.floor(flatGameFrame / (60 / framerate)) % framerate
  currentAnimFrame -= startAnimFrame
  if (currentAnimFrame < 0) {
    currentAnimFrame += framerate
  }
  return currentAnimFrame
}
