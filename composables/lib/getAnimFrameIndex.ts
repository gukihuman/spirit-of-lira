export function getAnimFrameIndex(stateStartFrame, currentFrame, frameLength) {
  let startFrameOffset = stateStartFrame % (60 / frameLength)
  let flatStateStartFrame = stateStartFrame - startFrameOffset
  let flatGameFrame = currentFrame - startFrameOffset
  let startAnimFrame =
    Math.floor(flatStateStartFrame / (60 / frameLength)) % frameLength
  let currentAnimFrame =
    Math.floor(flatGameFrame / (60 / frameLength)) % frameLength
  currentAnimFrame -= startAnimFrame
  if (currentAnimFrame < 0) {
    currentAnimFrame += frameLength
  }
  return currentAnimFrame
}
