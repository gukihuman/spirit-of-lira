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
    }, 10),
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
    _keyClear: l.debounce(() => {
      Keyboard().buttons = []
    }, 500),
    keyDown: (event: any) => {
      if (!Keyboard().buttons.includes(event.key))
        Keyboard().buttons.push(event.key)
      Listeners()._keyClear()
    },
    keyUp: (event: any) => {
      l.remove(Keyboard().buttons, (key) => key === event.key)
    },
  }),
})
