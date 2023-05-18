class Storage {
  //
  // 📜 change "any" to actual type
  entities: Map<string, any> = new Map()
  systems: Map<string, any> = new Map()

  webps: Map<string, any> = new Map()
  jsons: Map<string, any> = new Map()
}
export const gstorage = new Storage()
