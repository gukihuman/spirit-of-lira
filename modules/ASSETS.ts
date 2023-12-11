type Mds = { [key: string]: string }
type Audios = { [key: string]: string }
type Webps = { [key: string]: string }
type Jsons = { [key: string]: AnyObject }
// automatically loads from assets folder by load.ts
class Assets {
  // key is a name of the file
  // value is a path to the file for audios, webps, mds
  audios: Audios = {}
  webps: Webps = {}
  mds: Mds = {}
  jsons: Jsons = {} // value is a parsed json object for jsons
}
export const ASSETS = new Assets()
