interface Board {
  buttons: string[]
  buttonsCache: string[]
  buttonsToAdd: string[]
  buttonsToRemove: string[]
  tap: {
    buttons: string[]
    states: string[]
  }
  hold: {
    buttons: string[]
    states: string[]
  }
}
interface Mouse {
  x: number
  y: number
  angleToHero: number
  distanceToHero: number
  buttons: string[]
  buttonsCache: string[]
  buttonsToAdd: string[]
  buttonsToRemove: string[]
  tap: {
    buttons: string[]
    states: string[]
  }
  hold: {
    buttons: string[]
    states: string[]
  }
}
interface Pad {
  readonly buttonList: string[]
  connected: boolean
  buttons: string[]
  buttonsCache: string[]
  axes: number[]
  tap: {
    buttons: string[]
    states: string[]
  }
  hold: {
    buttons: string[]
    states: string[]
  }
}
class Input {
  //
  board: Board = {
    buttons: [],
    buttonsCache: [],
    buttonsToAdd: [],
    buttonsToRemove: [],
    tap: {
      buttons: [],
      states: [],
    },
    hold: {
      buttons: [],
      states: [],
    },
  }
  mouse: Mouse = {
    x: 0,
    y: 0,
    angleToHero: 0,
    distanceToHero: 0,
    buttons: [],
    buttonsCache: [],
    buttonsToAdd: [],
    buttonsToRemove: [],
    tap: {
      buttons: [],
      states: [],
    },
    hold: {
      buttons: [],
      states: [],
    },
  }
  pad: Pad = {
    buttonList: [
      "A",
      "B",
      "X",
      "Y",
      "LB",
      "RB",
      "LT",
      "RT",
      "Start",
      "Menu",
      "LS",
      "RS",
      "Up",
      "Down",
      "Left",
      "Right",
    ],
    connected: false,
    buttons: [],
    buttonsCache: [],
    axes: [0, 0, 0, 0],
    tap: {
      buttons: [],
      states: [],
    },
    hold: {
      buttons: [],
      states: [],
    },
  }
  initialize() {
    this.settingButtonsUpdate()

    addEventListener("gamepadconnected", () => this.padConnectListener())
    addEventListener("gamepaddisconnected", () => this.padDisconnectListener())

    addEventListener("mousemove", (event) => this.mouseMoveListener(event))
    addEventListener("mousedown", (event) => this.mouseDownListener(event))
    addEventListener("mouseup", (event) => this.mouseUpListener(event))

    addEventListener("keydown", (event) => this.keyDownListener(event))
    addEventListener("keyup", (event) => this.keyUpListener(event))
  }
  update() {
    this.boardUpdate()
    this.statesUpdate("board")

    this.mouseUpdate()
    this.statesUpdate("mouse")

    if (this.pad.connected) {
      this.padUpdate()
      this.statesUpdate("pad")
    }
  }
  settingButtonsUpdate() {
    for (let i of ["board", "mouse", "pad"]) {
      this[i].tap.buttons = l.values(User().settings[i].tap)
      this[i].tap.states = l.keys(User().settings[i].tap)
      this[i].hold.buttons = l.values(User().settings[i].hold)
      this[i].hold.states = l.keys(User().settings[i].hold)
    }
  }
  private statesUpdate(source: "board" | "mouse" | "pad") {
    // on tap
    this[source].tap.buttons.forEach((settingButton, index) => {
      if (
        this[source].buttons.includes(settingButton) &&
        !this[source].buttonsCache.includes(settingButton)
      ) {
        const state = this[source].tap.states[index]
        States()[state] = !States()[state]
      }
    })
    // on hold
    this[source].hold.buttons.forEach((settingButton, index) => {
      if (this[source].buttons.includes(settingButton)) {
        const state = this[source].hold.states[index]
        States()[state] = true
      } else if (this[source].buttonsCache.includes(settingButton)) {
        const state = this[source].hold.states[index]
        States()[state] = false
      }
    })
  }

  // board
  private keyDownListener(event) {
    this.board.buttonsToAdd.push(event.key)
    this.debouncedClearBoard()
  }
  private keyUpListener(event) {
    this.board.buttonsToRemove.push(event.key)
  }
  private boardUpdate() {
    //
    this.board.buttonsCache = l.cloneDeep(this.board.buttons)

    this.board.buttonsToAdd.forEach((buttonToAdd) => {
      if (!this.board.buttons.includes(buttonToAdd))
        this.board.buttons.push(buttonToAdd)
      l.remove(this.board.buttonsToAdd, (button) => button === buttonToAdd)
    })

    this.board.buttonsToRemove.forEach((buttonToRemove) => {
      l.remove(this.board.buttons, (button) => button === buttonToRemove)
      l.remove(
        this.board.buttonsToRemove,
        (button) => button === buttonToRemove
      )
    })
  }

  // mouse
  private mouseMoveListener(event) {
    this.mouse.x = event.offsetX - 1920 / 2 + User().data.hero.x
    this.mouse.y = event.offsetY - 1080 / 2 + User().data.hero.y
    this.mouse.angleToHero = Math.atan2(
      User().data.hero.y - this.mouse.y,
      User().data.hero.x - this.mouse.x
    )
    this.mouse.distanceToHero = findDistance(User().data.hero, this.mouse)
  }
  private mouseDownListener(event) {
    if (!this.mouse.buttons.includes(event.button))
      this.mouse.buttons.push(event.button)
    this.debouncedClearMouse()
  }
  private mouseUpListener(event) {
    this.mouse.buttonsToRemove.push(event.button)
  }
  private mouseUpdate() {
    //
    this.mouse.buttonsCache = l.cloneDeep(this.mouse.buttons)

    this.mouse.buttonsToAdd.forEach((buttonToAdd) => {
      if (!this.mouse.buttons.includes(buttonToAdd))
        this.mouse.buttons.push(buttonToAdd)
      l.remove(this.mouse.buttonsToAdd, (button) => button === buttonToAdd)
    })

    this.mouse.buttonsToRemove.forEach((buttonToRemove) => {
      l.remove(this.mouse.buttons, (button) => button === buttonToRemove)
      l.remove(
        this.mouse.buttonsToRemove,
        (button) => button === buttonToRemove
      )
    })
  }

  // pad
  private padConnectListener() {
    this.pad.connected = true
    input.debouncedHideCursor()
    addEventListener("mousemove", this.hideCursorListener)
    console.log(timeNow() + ` ✅ Pad: connected`)
  }
  private padDisconnectListener() {
    this.pad.connected = false
    States().cursor = true
    removeEventListener("mousemove", this.hideCursorListener)
    console.log(timeNow() + ` ❎ Pad: disconnected`)
  }
  private padUpdate() {
    this.pad.buttonsCache = this.pad.buttons
    const gamepadRaw = navigator.getGamepads()[0] || undefined
    const pressed: string[] = []
    gamepadRaw?.buttons.forEach((button, index) => {
      if (button.pressed) {
        pressed.push(this.pad.buttonList[index])
      }
    })
    const axes: number[] = []
    gamepadRaw?.axes.forEach((axis) => {
      axes.push(Number(axis.toFixed(2)))
    })
    this.pad.axes = axes
    this.pad.buttons = pressed
  }

  private hideCursorListener() {
    States().cursor = true
    input.debouncedHideCursor()
  }

  debouncedHideCursor = l.debounce(() => (States().cursor = false), 3000)

  // in case button up effect won't work (happens sometimes)
  debouncedClearBoard = l.debounce(() => (input.board.buttons = []), 500)
  debouncedClearMouse = l.debounce(() => (input.mouse.buttons = []), 500)
}
export const input = new Input()
