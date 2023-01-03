interface State {
  buttons: string[]
  buttonsCache: string[]
}

export const Keyboard = defineStore("keyboard", {
  state: (): State => ({
    buttons: [],
    buttonsCache: [],
  }),
})
