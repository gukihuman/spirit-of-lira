interface State {
  devAccess: boolean
  overwriteDataAllowed: boolean
}
export const States = defineStore("states", {
  state: (): State => ({
    devAccess: false,
    overwriteDataAllowed: false,
  }),
})
