type Mds = { [key: string]: string }
type Audios = { [key: string]: string }
type Webps = { [key: string]: string }
type Jsons = { [key: string]: AnyObject }
// automatically loads from assets folder by load.ts
class Assets {
  // key is a name of the file
  // for audios, webps, mds - value is a path to the file
  mds: Mds = {}
  audios: Audios = {}
  webps: Webps = {}
  jsons: Jsons = {} // for jsons - value is a parsed json object
}
export const ASSETS = new Assets()
