type RootKeys = keyof Root
type Root = {
  loading: boolean
  scene: boolean
  world: World | boolean
}
type WorldKeys = keyof World
type World = {
  gameplay: boolean
  interface: Inter | boolean
}
type InterKeys = keyof Inter
type Inter = {
  settings: Settings | boolean
  skills: Skills | boolean
}
type SettingsKeys = keyof Settings
type Settings = {
  general: boolean
  gamepad: boolean
  keyboard: boolean
  info: boolean
}
type SkillsKeys = keyof Skills
type Skills = {
  sword: boolean
  bow: boolean
  magic: boolean
}
class Context {
  echo: Root = this.set("loading")
  set(
    level1: RootKeys,
    level2?: WorldKeys,
    level3?: InterKeys,
    level4?: SettingsKeys | SkillsKeys
  ) {
    const root: Root = {
      loading: false,
      scene: false,
      world: false,
    }
    if (level1 === "loading") root.loading = true
    if (level1 === "scene") root.scene = true
    if (level1 === "world") {
      root.world = {
        gameplay: false,
        interface: false,
      }
      if (!level2 || level2 === "gameplay") root.world.gameplay = true
      if (level2 === "interface") {
        root.world.interface = {
          settings: false,
          skills: false,
        }
        if (!level3 || level3 === "settings") {
          let settings = root.world.interface.settings
          settings = {
            general: false,
            gamepad: false,
            keyboard: false,
            info: false,
          }
          if (!level4 || level4 === "general") settings.general = true
          if (level4 === "gamepad") settings.gamepad = true
          if (level4 === "keyboard") settings.keyboard = true
          if (level4 === "info") settings.info = true
        }
        if (level3 === "skills") {
          let skills = root.world.interface.skills
          skills = {
            sword: false,
            bow: false,
            magic: false,
          }
          if (!level4 || level4 === "sword") skills.sword = true
          if (level4 === "bow") skills.bow = true
          if (level4 === "magic") skills.magic = true
        }
      }
    }
    this.echo = root
    return this.echo
  }
}
export const CONTEXT = LIBRARY.resonate(new Context())
