declare global {
  export interface UserData {
    [index: string]: any
  }
}
interface State {
  data: UserData
}
export const User = defineStore("user", {
  state: (): State => ({
    data: {
      hero: {},
      settings: {},
    },
  }),
})
