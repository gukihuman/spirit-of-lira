import updateCollisionPost from "~~/server/api/updateCollision.post"

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
    Map().mapOffsetDelay[0] = Map().mapOffset[0]
    Map().mapOffsetDelay[1] = Map().mapOffset[1]
  }

  // edit
  if (Gamepad().buttonsStatus.find((key) => key === "A")) {
    let hero = Entity().entities.find((i) => i.id == 0)
    let x = Math.floor(hero.X / 120)
    let y = Math.floor(hero.Y / 120)
    Map().collision[y][x] = true
  }

  if (Frame().current % 60 === 0) {
    updateCollision("start", Map().collision)
  }
}
