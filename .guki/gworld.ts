class World {
  entities: Map<number, any> = new Map()
  systems: Map<string, any> = new Map()
}
export const gworld = new World()
