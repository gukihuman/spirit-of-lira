export const MainWindow = defineStore("mainWindow", {
  state: () => ({
    // controlled by MainWindowSetSize
    width: 0,
    height: 0,
    scale: 0,
  }),
})
