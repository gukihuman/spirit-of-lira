declare global {
  interface Position {
    x: number
    y: number
  }
}
class Pos {
  component: Position = {
    x: 0,
    y: 0,
  }
}
export const POSITION = new Pos()
