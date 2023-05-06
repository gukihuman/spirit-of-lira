class World {
  // 📜 change "any" to actual type

  public entities: Map<string, any> = new Map()
  public components: Map<string, any> = new Map()
  public systems: Map<string, any> = new Map()
}
export const gworld = new World()
