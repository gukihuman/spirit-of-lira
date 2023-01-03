interface State {
  [index: string]: any
}
export const Listeners = defineStore("listeners", {
  state: (): State => ({
    resize: l.debounce(() => setViewportSize(), 5),
    padConnect: () => {
      Pad().connected = true
      Listeners()._hideCursor()
      addEventListener("mousemove", Listeners().hideCursor)
      console.log(timeNow() + ` ✅ Pad: connected`)
    },
    padDisconnect: () => {
      Pad().connected = false
      States().cursor = true
      removeEventListener("mousemove", Listeners().hideCursor)
      console.log(timeNow() + ` ❎ Pad: disconnected`)
    },
    _hideCursor: l.debounce(() => (States().cursor = false), 3000),
    hideCursor: () => {
      States().cursor = true
      Listeners()._hideCursor()
    },
    _stopMouseMove: l.debounce(() => {
      States().mouseMoving = false
    }, 50),
    mouseMove: () => {
      States().mouseMoving = true
      Listeners()._stopMouseMove()
    },
    mouseUpdate: (e: any) => {
      Mouse().x = e.offsetX - Settings().displayWidth / 2 + User().data.hero.x
      Mouse().y = e.offsetY - Settings().displayHeight / 2 + User().data.hero.y
      Mouse().angleToHero = Math.atan2(
        User().data.hero.y - Mouse().y,
        User().data.hero.x - Mouse().x
      )
      Mouse().distanceToHero = findDistance(User().data.hero, Mouse())
    },
    mouseDown: (e: any) => {
      if (!Mouse().buttons.includes(e.button)) Mouse().buttons.push(e.button)
    },
    mouseUp: (e: any) => {
      l.remove(Mouse().buttons, (key) => key === e.button)
    },
    _keyClear: l.debounce(() => {
      Keyboard().buttons = []
    }, 500),
    keyDown: (e: any) => {
      if (!Keyboard().buttons.includes(e.key)) {
        Keyboard().buttons.push(e.key)
        l.keys(States()).forEach((state: string) => {
          if (
            l.keys(User().data.settings.control.keyboard).includes(state) &&
            User().data.settings.control.keyboard[state] === e.key
          ) {
            States()[state] = !States()[state]
          }
        })
      }
      Listeners()._keyClear()
    },
    keyUp: (e: any) => {
      l.remove(Keyboard().buttons, (key) => key === e.key)
    },
  }),
})
