export function hero() {
  return Game().entities.find((e) => e.name == "hero")
}
