interface State {
  x: number
  y: number
  angleToHero: number
  distanceToHero: number
  buttons: string[]
  buttonsCache: string[]
}

export const Mouse = defineStore("mouse", {
  state: (): State => ({
    x: 0,
    y: 0,
    angleToHero: 0,
    distanceToHero: 0,
    buttons: [],
    buttonsCache: [],
  }),
})
