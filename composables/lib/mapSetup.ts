export function mapSetup() {
  mapStore().collision.push([[true], [false], [true]]);
  mapStore().collision.push([[false], [true], [true]]);
}
