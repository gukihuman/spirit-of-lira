class Confirm {
    echo = {
        text: "",
        input: "",
        input_focus: false,
        left_fn: () => {},
        right_fn: () => {
            CONTEXT.echo.confirm = false
        },
    }
    default_echo = _.cloneDeep(this.echo)
    reset() {
        this.echo = _.cloneDeep(this.default_echo)
    }
    process() {
        if (g.just_off(CONTEXT, "echo.confirm")) this.reset()
    }
}
export const CONFIRM = new Confirm()
