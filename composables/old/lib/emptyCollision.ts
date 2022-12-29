export function emptyCollision() {
  Game().frame % 60 == 0 ? console.log(Map().collision) : {}
  if (Map().collision.length === 0) {
    for (let i = 0; i < 60; i++) {
      let row = []
      for (let j = 0; j < 60; j++) {
        row.push(false)
      }
      Map().collision.push(row)
    }
  }
}
