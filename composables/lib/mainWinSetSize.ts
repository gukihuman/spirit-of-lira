export function mainWinSetSize() {
  const userWidth = innerWidth * devicePixelRatio
  const userHeight = innerHeight * devicePixelRatio
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9]
  if (baseWidth > baseHeight) {
    MainWindow().scale = userHeight / Canvas().height / devicePixelRatio
  } else {
    MainWindow().scale = userWidth / Canvas().width / devicePixelRatio
  }
}
