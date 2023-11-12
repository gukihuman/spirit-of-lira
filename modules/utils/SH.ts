class Shortcuts {
  stopHero() {
    WORLD.hero.MOVE.finaldestination = _.clone(WORLD.hero.POSITION)
  }
}
export const SH = new Shortcuts()
