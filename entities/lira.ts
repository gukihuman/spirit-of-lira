export default class Lira {
  // 📜 thats for states and some ai
  alive = {
    speed: 14,
    size: 50,
  }
  visual = {
    path: new URL("/assets/entities/lira.json", import.meta.url).href,
    firstFrames: { idle: 11, walk: 9, run: 4 },
  }
}
