class Storage {
  //
  // auto-imported from corresponding folders
  entities: Map<string, any> = new Map()
  components: Map<string, any> = new Map()
  systems: Map<string, any> = new Map() // classes

  // auto-imported from assets folder
  webps: Map<string, any> = new Map()
  jsons: Map<string, any> = new Map()
}
export const gstorage = new Storage()
