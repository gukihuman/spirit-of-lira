export default class Bunbo {
  alive = {
    speed: 10,
    size: 50,
  }
  visual = {
    path: new URL("/assets/entities/bunbo.json", import.meta.url).href,
  }
}