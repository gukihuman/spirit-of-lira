class InputUpdate {
    last_active_device = "keyboard"
    mouse: { x: number; y: number } = { x: 0, y: 0 }
    init() {
        INPUT.init(REFS.viewport) // input controller
    }
    process() {
        INPUT.update()

        let gamepad_axes_active = false
        INPUT.gamepad.axes.forEach((axis) => {
            if (Math.abs(axis) > SETTINGS.inputOther.gamepad.deadZone) {
                gamepad_axes_active = true
            }
        })
        if (INPUT.gamepad.justPressed.length > 0 || gamepad_axes_active) {
            this.last_active_device = "gamepad"
        } else if (INPUT.keyboard.justPressed.length > 0) {
            this.last_active_device = "keyboard"
        } else if (
            INPUT.mouse.justPressed.length > 0 ||
            !COORD.compare(INPUT.mouse, this.mouse)
        ) {
            this.last_active_device = "mouse"
        }
        this.mouse.x = INPUT.mouse.x
        this.mouse.y = INPUT.mouse.y

        // watch first mouse move (or double click)
        // to prevent movement to the 0 0 coordinates
        if (!GLOBAL.firstMouseMove) {
            if (INPUT.mouse.x !== 0 || INPUT.mouse.y !== 0) {
                GLOBAL.firstMouseMove = true
            }
        }
        GLOBAL.lastActiveDevice = this.last_active_device
    }
}
export const INPUT_UPDATE = new InputUpdate()
