const hash = "c91da7e35388e155460e481d95cb148ee88a3846a72640dc4735887d375b012e"
interface Echo extends AnyObject {
    button_texts: [string, string]
}
class Confirm {
    echo: Echo = {
        show_content: true, // to transition between confirm content
        text: "",
        text_2: "",
        input: "",
        input_focus: false,
        double_button: false, // if false only right_fn will work
        buttons_higher: false, // layout for buttons
        button_texts: ["", "OK"],
        left_fn: () => {},
        right_fn: () => (CONTEXT.echo.confirm = false),
        patreon_mode: false,
    }
    default_echo = _.cloneDeep(this.echo)
    reset() {
        // can not just clone - lose reactivity
        _.assign(this.echo, _.cloneDeep(this.default_echo))
        SETTINGS.echo.focus.confirm_index = 1
    }
    process() {
        if (g.just_off(CONTEXT, "echo.confirm")) this.reset()
        if (
            CONTEXT.echo.confirm &&
            this.echo.input_focus &&
            INPUT.keyboard.justPressed.includes("Enter")
        ) {
            this.echo.left_fn()
        }
    }
    resolve_patreon_access() {
        if (!SETTINGS.echo.general.patreon_access) {
            CONTEXT.echo.confirm = true
            TIME.next(() => (REFS.input ? REFS.input.focus() : {}))
            this.echo.patreon_mode = true
            this.echo.double_button = true
            this.echo.button_texts = ["OK", "Cancel"]
            this.echo.left_fn = () => {
                const access_key = this.echo.input.trim().toLowerCase()
                const user_hash = CRYPTO_JS.SHA256(access_key).toString(
                    CRYPTO_JS.enc.Hex
                )
                if (user_hash === hash) {
                    this.echo.show_content = false
                    TIME.after(500, () => {
                        this.echo.show_content = true
                    })
                    SETTINGS.echo.general.patreon_access = true
                    SAVE.update()
                    TIME.after(250, () => {
                        this.reset()
                        this.echo.buttons_higher = true
                        this.echo.text =
                            "Thank you! Patreon access granted. Have fun!"
                    })
                } else {
                    this.echo.show_content = false
                    TIME.after(500, () => {
                        this.echo.show_content = true
                    })
                    TIME.after(250, () => {
                        this.reset()
                        this.echo.double_button = true
                        this.echo.button_texts = ["Try again", "Cancel"]
                        SETTINGS.echo.focus.confirm_index = 0
                        this.echo.buttons_higher = true
                        this.echo.left_fn = () => {
                            this.echo.show_content = false
                            TIME.after(500, () => {
                                this.echo.show_content = true
                            })
                            TIME.after(250, () => {
                                this.reset()
                                this.resolve_patreon_access()
                                SETTINGS.echo.focus.confirm_index = 0
                            })
                        }
                        this.echo.text = "Sorry, that seems to be incorrect."
                    })
                }
            }
        } else {
            CONTEXT.echo.confirm = true
            this.echo.text =
                "Turning off Patreon access means you'll need to enter the access key again later, as it won't be saved."
            this.echo.text_2 = "Still want to turn it off?"
            this.echo.double_button = true
            this.echo.button_texts = ["OK", "Cancel"]
            this.echo.left_fn = () => {
                CONTEXT.echo.confirm = false
                SETTINGS.echo.general.patreon_access = false
                SAVE.update()
            }
        }
    }
}
export const CONFIRM = LIBRARY.resonate(new Confirm())
