type Root = "loading" | "world" | "scene"
type World = "gameplay" | "interface"
type Interface = "settings" | "skills" | "girls" | "inventory"
type Settings = "general" | "gamepad" | "keyboard" | "statistics" | "info"
type ContextNow = Root | World | Interface | Settings
type Echo = {
  active: ContextNow
}
class Context {
  echo: Echo = { active: "loading" }
  private stack: ContextNow[] = []
  get(): ContextNow | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null
  }
  getFull(): ContextNow[] {
    return [...this.stack]
  }
  set(...path: ContextNow[]): void {
    this.stack = [...path]
  }
  push(context: ContextNow): void {
    this.stack.push(context)
  }
  pop(): void {
    this.stack.pop()
  }
  check(...path: ContextNow[]): boolean {
    return (
      this.stack.length === path.length &&
      path.every((context, index) => this.stack[index] === context)
    )
  }
}
export const CONTEXT = LIBRARY.resonate(new Context())
