class Static {
  async init() {
    await CREATOR.create("magic-tree", { sprite: { static: true } })
    await CREATOR.create("bridge-fence", { sprite: { static: true } })
    await CREATOR.create("bunny", { sprite: { static: true } })
    await CREATOR.create("low-tree", { sprite: { static: true } })
    await CREATOR.create("low-forest", { sprite: { static: true } })
  }
}
export const STATIC = new Static()
