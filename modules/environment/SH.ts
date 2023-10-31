class Shortcuts {
  stopHero() {
    WORLD.hero.move.finaldestination = _.clone(WORLD.hero.position)
  }
}
export const SH = new Shortcuts()
