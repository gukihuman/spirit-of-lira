class Cursor {
  async init() {
    await CREATOR.create("cursor")
    await CREATOR.create("cursor-no")
    await CREATOR.create("cursor-cast")
    await CREATOR.create("mousepoint")
  }
}
export const CURSOR = new Cursor()
