export function updateMainWindowStyle() {
  let style = usePiniaStore().mainWindowStyle;
  let [baseWidth, baseHeight] = [innerWidth / 16, innerHeight / 9];
  if (baseWidth > baseHeight) {
    style.height = Number(innerHeight.toFixed(0));
    style.width = Number((baseHeight * 16).toFixed(0));
    style.top = Number(((innerHeight - style.height) / 2).toFixed(0));
    style.left = 0;
  } else {
    style.height = Number((baseWidth * 9).toFixed(0));
    style.width = Number(innerWidth.toFixed(0));
    style.top = 0;
    style.left = Number(((innerWidth - style.width) / 2).toFixed(0));
  }
}
