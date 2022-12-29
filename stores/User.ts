interface State {
  data: {}
}
export const User = defineStore("user", {
  state: (): State => ({
    data: {},
  }),
})
