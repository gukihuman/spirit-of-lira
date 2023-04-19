class Hero {
  public unique = true
  // 📜 id must be created with ggm
  public id = 0
  public name = "hero"
  public sprite = new URL("/assets/hero/hero.json", import.meta.url).href
  public x = 1920 / 2
  public y = 1920 / 2

  public process = () => {}
}

export default () => {
  const hero = new Hero()
  ggm.add(hero)
}
