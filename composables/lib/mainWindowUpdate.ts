export function mainWindowUpdate() {
  let mainWindow = commonStore().mainWindow;
  let [baseWidth, baseHeight] = [innerWidth / 16, innerHeight / 9];
  if (baseWidth > baseHeight) {
    mainWindow.height = innerHeight;
    mainWindow.width = (baseHeight * 16).toFixed(0);
    mainWindow.scale = innerHeight / canvasStore().height;
  } else {
    mainWindow.height = (baseWidth * 9).toFixed(0);
    mainWindow.width = innerWidth;
    mainWindow.scale = innerWidth / canvasStore().width;
  }
}
