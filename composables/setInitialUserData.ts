export function setInitialUserData(): void {
  User().data = {
    hero: genHero(),
    settings: {
      gamepad: {
        deadZone: 0.15,
        uiStates: {
          // 📜 menu: ["Start", false],
        },
      },
    },
  }
}
