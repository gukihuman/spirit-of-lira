import staticCollection from "@/entities/static"
class Static {
  async init() {
    for (const key in staticCollection) {
      if (key === "🔧") continue
      await CREATOR.create(key, { sprite: {} })
    }
  }
}
export const STATIC = new Static()
