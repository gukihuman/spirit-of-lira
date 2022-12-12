export function mainWindowUpdate() {
  let mainWindow = commonStore().mainWindow;
  const userWidth = innerWidth * devicePixelRatio;
  const userHeight = innerHeight * devicePixelRatio;
  let [baseWidth, baseHeight] = [userWidth / 16, userHeight / 9];
  if (baseWidth > baseHeight) {
    mainWindow.height = userHeight;
    mainWindow.width = baseHeight * 16;
    mainWindow.scale = userHeight / canvasStore().height / devicePixelRatio;
  } else {
    mainWindow.height = baseWidth * 9;
    mainWindow.width = userWidth;
    mainWindow.scale = userWidth / canvasStore().width / devicePixelRatio;
  }
}
