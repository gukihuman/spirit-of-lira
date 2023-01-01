interface State {
  devAccess: boolean
  overwriteDataAllowed: boolean
  cursor: boolean
  allLoaded: boolean
  mouseMoving: boolean
}
export const States = defineStore("states", {
  state: (): State => ({
    devAccess: false,
    overwriteDataAllowed: false,
    cursor: true,
    allLoaded: false,
    mouseMoving: false,
  }),
})
