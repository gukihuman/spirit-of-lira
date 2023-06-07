class Store {
  //
  // auto-imported from corresponding folders
  entities: Map<string, { [key: string]: any }> = new Map()
  components: Map<string, { [key: string]: any }> = new Map()
  systems: Map<string, any> = new Map() // classes

  // auto-imported from assets folder
  webps: Map<string, string> = new Map()
  jsons: Map<string, { [key: string]: any }> = new Map()
}
export const STORE = new Store()
