export function setViewportSize() {
  const userWidth = innerWidth * devicePixelRatio
  const userHeight = innerHeight * devicePixelRatio
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9]
  if (baseWidth > baseHeight) {
    Viewport().scale = userHeight / Canvas().height / devicePixelRatio
  } else {
    Viewport().scale = userWidth / Canvas().width / devicePixelRatio
  }
}
