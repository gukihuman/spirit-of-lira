interface State {
  data: any
}
export const User = defineStore("user", {
  state: (): State => ({
    data: {},
  }),
})
