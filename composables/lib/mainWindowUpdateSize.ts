export function mainWindowSetSize() {
  const userWidth = innerWidth * devicePixelRatio
  const userHeight = innerHeight * devicePixelRatio
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9]
  if (baseWidth > baseHeight) {
    MainWindow().height = userHeight
    MainWindow().width = baseHeight * 16
    MainWindow().scale = userHeight / Canvas().height / devicePixelRatio
  } else {
    MainWindow().height = baseWidth * 9
    MainWindow().width = userWidth
    MainWindow().scale = userWidth / Canvas().width / devicePixelRatio
  }
}
