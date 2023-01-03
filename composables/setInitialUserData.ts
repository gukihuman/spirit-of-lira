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
        keyMouse: {
          heroMove: "o",
        },
      },
    },
  }
}
