class ClassStorage {
  //
  // 📜 change "any" to actual type
  entities: Map<string, any> = new Map()
  systems: Map<string, any> = new Map()
}
export const gcs = new ClassStorage()
