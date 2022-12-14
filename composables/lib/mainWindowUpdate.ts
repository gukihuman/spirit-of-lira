export function mainWindowUpdate() {
  let mainWindow = Common().mainWindow
  const userWidth = innerWidth * devicePixelRatio
  const userHeight = innerHeight * devicePixelRatio
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9]
  if (baseWidth > baseHeight) {
    mainWindow.height = userHeight
    mainWindow.width = baseHeight * 16
    mainWindow.scale = userHeight / Canvas().height / devicePixelRatio
  } else {
    mainWindow.height = baseWidth * 9
    mainWindow.width = userWidth
    mainWindow.scale = userWidth / Canvas().width / devicePixelRatio
  }
}
