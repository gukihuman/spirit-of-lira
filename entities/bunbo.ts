export default class Bunbo {
  name = "bunbo"
  sprite = new URL("/assets/entities/bunbo.json", import.meta.url).href
  mapChunks = gmm.greenForestCnunks
  speed = 10
  size = 70
}
