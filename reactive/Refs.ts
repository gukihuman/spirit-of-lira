interface State {
  [index: string]: any
}
export const Refs = defineStore("ref", {
  state: (): State => ({
    background: null,
    viewport: null,
  }),
})
