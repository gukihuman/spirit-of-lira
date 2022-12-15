export function mapSetup() {
  // empty array is needed for MapCollision to load before fetch
  for (let y = 0; y < 100; y++) {
    let row = []
    for (let x = 0; x < 100; x++) {
      row.push(false)
    }
    Map().collision.push(row)
  }
  //
}

export function mapEditUpdate() {
  if (Frame().current % 2 === 0) {
    Map().offsetDelay[0] = Map().offset[0]
    Map().offsetDelay[1] = Map().offset[1]
  }

  // edit
  let hero = Entity().hero
  let x = Math.floor(hero.X / 120)
  let y = Math.floor(hero.Y / 120)
  if (Gamepad().buttons.find((key) => key === "A")) {
    Map().collision[y][x] = true
  }
  if (Gamepad().buttons.find((key) => key === "B")) {
    Map().collision[y][x] = false
  }

  if (Frame().current % 60 === 0) {
    updateCollision("start", Map().collision)
  }
}
