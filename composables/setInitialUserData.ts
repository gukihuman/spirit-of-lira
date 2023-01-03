export function setInitialUserData(): void {
  User().data = {
    hero: genHero(),
    settings: {
      control: {
        gamepad: {
          deadZone: 0.15,
          uiStates: {
            // 📜 menu: ["Start", false],
          },
        },
        keyboard: {
          heroMove: "o",
          autoHeroMove: "i",
          fullscreen: "a",
        },
        mouse: {
          heroMove: 0,
        },
      },
    },
  }
}
