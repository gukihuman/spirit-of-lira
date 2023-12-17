type ContextStates = "world" | "novel" | "settings" | "backpack"
type Stack = string[]
class Context {
    private stack = []
    process() {
        // 📜 implement emiting root game state change event
        // if (this.active_root !== this.last.active_root) {
        //     EVENTS.emitSingle("root game state changed")
        // }
    }
}
export const CONTEXT = LIBRARY.resonate(new Context())
