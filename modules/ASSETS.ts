type Paths = { [file_name: string]: string }
type Jsons = { [file_name: string]: AnyObject }
// automatically loaded from assets folder by load.ts
class Assets {
    mp3_paths: Paths = {}
    webp_paths: Paths = {}
    md_paths: Paths = {}
    jsons: Jsons = {}
    get_mp3_path = (file_name: string) => this.mp3_paths[file_name]
    get_webp_path = (file_name: string) => this.webp_paths[file_name]
    get_md_path = (file_name: string) => this.md_paths[file_name]
    get_json = (file_name: string) => this.jsons[file_name]
}
export const ASSETS = new Assets()
