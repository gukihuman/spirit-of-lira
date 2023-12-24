const interface_contexts = ["settings", "backpack"] as const
type InterfaceContext = (typeof interface_contexts)[number]
const settings_contexts = ["general", "gamepad", "keyboard", "info"] as const
type SettingsContext = (typeof settings_contexts)[number]

type LastOpened = { settings: SettingsContext }
let last_opened: LastOpened = { settings: "general" }

class Echo {
    loading = true
    empty = false
    novel = false
    settings: false | SettingsContext = false
    backpack = false

    // helper contexts, auto updated in process
    // also used externally as index to turn off specific echo key
    gameplay = false
    world = false
    interface: false | InterfaceContext = false
}
class Context {
    echo = new Echo()
    last = { echo: this.echo }
    process() {
        if (this.echo.novel || this.echo.interface || this.echo.empty) {
            this.echo.gameplay = false
        } else this.echo.gameplay = true

        if (this.echo.novel || this.echo.empty) this.echo.world = false
        else this.echo.world = true

        for (const context of interface_contexts) {
            if (this.echo[context]) {
                this.echo.interface = context
                break
            } else this.echo.interface = false
        }

        if (this.echo.novel !== this.last.echo.novel) {
            EVENTS.emitSingle("novel context changed")
        }
    }
    init() {
        EVENTS.onSingle("toggle backpack", () => {
            if (!this.echo.interface) {
                this.echo.backpack = true
            } else if (this.echo.backpack) {
                this.echo.backpack = false
            } else {
                this.echo[this.echo.interface] = false
                this.echo.backpack = true
            }
        })
        EVENTS.onSingle("toggle settings", () => {
            if (!this.echo.interface) {
                this.echo.settings = SETTINGS.last_opened
            } else if (this.echo.settings) {
                last_opened.settings = SETTINGS.last_opened
                this.echo.settings = false
            } else {
                this.echo[this.echo.interface] = false
                this.echo.settings = SETTINGS.last_opened
            }
        })
        EVENTS.onSingle("quit interface", () => {
            TIME.next(() => {
                if (!this.echo.interface) return
                if (SETTINGS.echo.editHotkeyMode) return
                this.echo[this.echo.interface] = false
            })
        })
    }
}
export const CONTEXT = LIBRARY.resonate(new Context()) as Context
