declare global {
    type SettingObject = {
        type: "hotkey" | "button" | "trigger" | "slider"
        prop?: string
        event?: string
        events?: string[]
    }
    type Setting = {
        [key: string]: SettingObject
    }
    type Tab = {
        center_column?: Setting
        left_column: Setting
        right_column: Setting
    }
}
type Focus = {
    columnIndex: 0 | 1
    rowIndex: number
}
interface Echo extends AnyObject {
    focus: Focus
}
let show_message_time_token = ""
let max_setting_index = 0
let left_column_length = 0
let right_column_length = 0
class Settings {
    last_opened = "general"
    context_list = ["general", "gamepad", "keyboard", "info"]
    get context_index() {
        return this.context_list.findIndex((context) => {
            return CONTEXT.echo.settings === context
        })
    }
    last = { context_index: 0 }
    get context() {
        return this.context_list[this.context_index]
    }
    echo: Echo = {
        focus: { columnIndex: 0, rowIndex: 0 },
        show_panel: false, // switching delay
        editHotkeyMode: false,
        showButtonIcon: true,
        show_hotkey: true, // used to update
        button_pressed: false,
        show_message: "",
    }
    general = {
        music: 0.0, // 0.8
        sound: 0.3, // 0.8
        // auto attack after kill and also autotarget for mouse like on gamepad
        easyFight: false,
        attackBack: true,
        // keepLock is about keeping lock after stop attacking, currently not working properly, like when its off, there is no way to lock target while attacking, ideally make possible to attack target without locking, coding is hard in that matter
        keepLock: true, // currently constant true
        showKeys: true,
        floatDamage: true,
    }
    interfaceInputEvents = {
        keyboard: {
            toggleFullscreen: "f",
            // toggle backpack: "i",
            "toggle settings": "r",
            "quit interface": "q",
        },
        gamepad: {
            toggleFullscreen: "Start",
            // toggle backpack: "B",
            "toggle settings": "Menu",
            "quit interface": "B",
            "resolve setting action": "A", // action
            "go down": "Down",
            "go up": "Up",
            "go left": "Left",
            "go right": "Right",
            "switch tab left": "LB",
            "switch tab right": "RB",
        },
    }
    worldInputEvents = {
        keyboard: {
            talk: " ", // action
            reset: " ", // action
            cast1: "e",
            cast2: "",
            cast3: "",
            autoMove: "w",
            toggleFullscreen: "f",
            // toggle backpack: "i",
            "toggle settings": "r",
        },
        mouse: {
            decide: 0,
            lockTarget: 2,
        },
        gamepad: {
            talk: "A", // action
            reset: "A", // action
            cast1: "X",
            cast2: "",
            cast3: "",
            toggleFullscreen: "Start",
            // toggle backpack: "B",
            "toggle settings": "Menu",
            lockTarget: "LB",
        },
    }
    novelInputEvents = {
        keyboard: {
            continue: " ", // action
            "close novel": "q",
            toggleFullscreen: "f",
            previousOption: "ArrowDown",
            nextOption: "ArrowUp",
            "toggle settings": "r",
        },
        mouse: {
            mouseContinue: 0,
        },
        gamepad: {
            continue: "A", // action
            "close novel": "B",
            toggleFullscreen: "Start",
            previousOption: "Down",
            nextOption: "Up",
            "toggle settings": "Menu",
        },
    }
    inputOther = {
        gamepad: {
            deadZone: 0.15,
        },
    }
    gamepad_tab: Tab = {
        left_column: {
            Action: {
                type: "hotkey",
                events: ["talk", "reset", "continue", "resolve setting action"],
            },
            Close: {
                type: "hotkey",
                events: ["close novel", "quit interface"],
            },
            Cast: { type: "hotkey", events: ["cast1"] },
            "Reset Default": { type: "button", event: "reset gamepad" },
        },
        right_column: {
            "Toggle Fullscreen": {
                type: "hotkey",
                events: ["toggleFullscreen"],
            },
            "Toggle Settings": { type: "hotkey", events: ["toggle settings"] },
        },
    }
    keyboard_tab: Tab = {
        left_column: {
            Action: { type: "hotkey", events: ["talk", "reset", "continue"] },
            Close: {
                type: "hotkey",
                events: ["close novel", "quit interface"],
            },
            Cast: { type: "hotkey", events: ["cast1"] },
            "Reset Default": { type: "button", event: "reset keyboard" },
        },
        right_column: {
            "Toggle Fullscreen": {
                type: "hotkey",
                events: ["toggleFullscreen"],
            },
            "Toggle Settings": { type: "hotkey", events: ["toggle settings"] },
            "Auto Move": { type: "hotkey", events: ["autoMove"] },
        },
    }
    general_tab: Tab = {
        center_column: {
            Music: { type: "slider" },
            Sound: { type: "slider" },
        },
        left_column: {
            "Auto-Attack Next Target": { type: "trigger", prop: "easyFight" },
            "Attack Back": { type: "trigger", prop: "attackBack" },
        },
        right_column: {
            "Show Hotkeys Icons": { type: "trigger", prop: "showKeys" },
            "Show Float Damage": { type: "trigger", prop: "floatDamage" },
        },
    }
    process() {
        this.updateShowSettingsPanel()
        this.resetSettingsFocus()
        this.updateSettingsFocus()
        if (this.echo.editHotkeyMode) {
            this.updateHotkey("gamepad")
            this.updateHotkey("keyboard")
        }
        if (!this.echo.editHotkeyMode) this.emitEvents()
        if (CONTEXT.echo.settings && !CONTEXT.last.echo.settings) {
            this.echo.show_message = ""
        }
    }
    private checkGamepadKeys = (device, setting, pressedKey) => {
        if (device !== "gamepad") return true
        const preventKeys = ["Up", "Down", "Left", "Right", "RB", "LB"]
        // allow only with Cast
        if (!setting.includes("Cast") && preventKeys.includes(pressedKey)) {
            this.echo.show_message =
                "Up, Down, Left, Right, RB, LB can be used only with Cast."
            TIME.cancel(show_message_time_token)
            show_message_time_token = TIME.after(
                5000,
                () => (this.echo.show_message = "")
            )
            return false
        }
        return true
    }
    private findPreviousEvents = (pressedKey, places, device) => {
        let previousEvents: string[] = []
        places.forEach((place) => {
            _.entries(place[device]).forEach(([key, value]) => {
                if (value === pressedKey) previousEvents.push(key)
            })
        })
        return previousEvents
    }
    private updateHotkey(device: "keyboard" | "gamepad") {
        if (
            CONTEXT.echo.settings !== device ||
            INPUT[device].justPressed.length === 0
        ) {
            return
        }
        let events: string[] = []
        const pressedKey = INPUT[device].justPressed[0]
        let newKeySetted = false
        let setting = ""
        if (HOTKEYS[device].includes(pressedKey)) {
            let device_tab = device + "_tab"
            if (this.echo.focus.columnIndex === 0) {
                setting = _.keys(this[device_tab].left_column)[
                    this.echo.focus.rowIndex
                ]
                if (this.checkGamepadKeys(device, setting, pressedKey)) {
                    events = this[device_tab].left_column[setting].events
                }
            } else {
                setting = _.keys(this[device_tab].right_column)[
                    this.echo.focus.rowIndex
                ]
                if (this.checkGamepadKeys(device, setting, pressedKey)) {
                    events = this[device_tab].right_column[setting].events
                }
            }
        }
        let preventEditHotkey = false
        function cleanPrevious(previousEvents, placeToClean) {
            previousEvents.forEach((event) => {
                if (
                    event === "resolve setting action" &&
                    setting !== "Action"
                ) {
                    preventEditHotkey = true
                }
                if (placeToClean[device][event] && !preventEditHotkey) {
                    placeToClean[device][event] = ""
                }
            })
        }
        const places = [
            this.interfaceInputEvents,
            this.worldInputEvents,
            this.novelInputEvents,
        ]
        const foundPlaces: AnyObject[] = []
        events.forEach((event) => {
            places.forEach((place) => {
                if (place[device][event] !== undefined) {
                    foundPlaces.push(place)
                    newKeySetted = true
                }
            })
        })
        if (newKeySetted) {
            const previousEvents = this.findPreviousEvents(
                pressedKey,
                places,
                device
            )
            places.forEach((place) => {
                cleanPrevious(previousEvents, place)
            })
            if (preventEditHotkey) {
                this.echo.show_message = "This button is reserved for Action."
                TIME.cancel(show_message_time_token)
                show_message_time_token = TIME.after(
                    5000,
                    () => (this.echo.show_message = "")
                )
                return
            }
            events.forEach((event) => {
                foundPlaces.forEach((place) => {
                    place[device][event] = pressedKey
                })
            })
            this.echo.showButtonIcon = false
            TIME.next(() => {
                this.echo.editHotkeyMode = false
                this.echo.showButtonIcon = true
            })
            this.echo.show_hotkey = false
            TIME.after_iterations(10, () => {
                this.echo.show_hotkey = true
            })
        }
    }
    updateShowSettingsPanel() {
        if (!CONTEXT.echo.settings) this.echo.show_panel = false
        if (CONTEXT.echo.settings && !CONTEXT.last.echo.settings) {
            this.echo.show_panel = true
        }
        if (this.context_index !== this.last.context_index) {
            this.echo.show_panel = false
            this.debouncedShowAnySettingsPanel()
        }
    }
    debouncedShowAnySettingsPanel = _.debounce(() => {
        this.echo.show_panel = true
    }, 100)
    resetSettingsFocus() {
        if (
            (CONTEXT.echo.interface && !CONTEXT.last.echo.interface) ||
            this.context_index !== this.last.context_index
        ) {
            this.echo.focus.columnIndex = 0
            this.echo.focus.rowIndex = 0
        }
    }
    updateSettingsFocus() {
        if (!CONTEXT.echo.settings || this.echo.editHotkeyMode) return
        left_column_length = 0
        right_column_length = 0
        if (CONTEXT.echo.settings === "keyboard") {
            left_column_length = _.keys(this.keyboard_tab.left_column).length
            right_column_length = _.keys(this.keyboard_tab.right_column).length
        } else {
            left_column_length = _.keys(this.gamepad_tab.left_column).length
            right_column_length = _.keys(this.gamepad_tab.right_column).length
        }
        max_setting_index = 0
        if (this.echo.focus.columnIndex === 0) {
            max_setting_index = left_column_length - 1
        } else {
            max_setting_index = right_column_length - 1
        }
    }
    reset_device_hotkeys(device) {
        this.echo.show_hotkey = false
        TIME.next(() => (this.echo.show_hotkey = true))
        this.worldInputEvents[device] = _.cloneDeep(
            SAVE.startSave.settings.worldInputEvents[device]
        )
        this.novelInputEvents[device] = _.cloneDeep(
            SAVE.startSave.settings.novelInputEvents[device]
        )
        this.interfaceInputEvents[device] = _.cloneDeep(
            SAVE.startSave.settings.interfaceInputEvents[device]
        )
        SAVE.update()
    }
    init() {
        EVENTS.onSingle("reset keyboard", () => {
            this.reset_device_hotkeys("keyboard")
        })
        EVENTS.onSingle("reset gamepad", () => {
            this.reset_device_hotkeys("gamepad")
        })

        // scene choices
        EVENTS.onSingle("previousOption", () => {
            if (NOVEL.echo.focusedChoiceIndex === null) return
            if (!NOVEL.echo[NOVEL.echo.activeLayer].choices) return
            const choices = NOVEL.echo[NOVEL.echo.activeLayer].choices
            let possibleIndex: number | null = null
            // 📜 maybe merge with "continue" in NOVEL.echo
            let startIndex = NOVEL.echo.focusedChoiceIndex - 1
            if (startIndex < 0) startIndex += choices.length
            for (let i = startIndex; i < choices.length; i--) {
                if (i < 0) i += choices.length
                let choice = choices[i]
                if (!choice.bulb) {
                    possibleIndex = i
                    break
                }
                const condition: Condition | undefined =
                    NOVEL.sceneConditions[choice.bulbScene]
                if (!condition) {
                    possibleIndex = i
                    break
                }
                if (condition.getCondition()) {
                    possibleIndex = i
                    break
                }
            }
            NOVEL.echo.focusedChoiceIndex = possibleIndex
        })
        EVENTS.onSingle("nextOption", () => {
            if (NOVEL.echo.focusedChoiceIndex === null) return
            if (!NOVEL.echo[NOVEL.echo.activeLayer].choices) return
            const choices = NOVEL.echo[NOVEL.echo.activeLayer].choices
            let possibleIndex: number | null = null
            // 📜 maybe merge with "continue" in NOVEL.echo
            let startIndex = NOVEL.echo.focusedChoiceIndex + 1
            if (startIndex >= choices.length) startIndex -= choices.length
            for (let i = startIndex; i < choices.length; i++) {
                if (i >= choices.length) i -= choices.length
                let choice = choices[i]
                if (!choice.bulb) {
                    possibleIndex = i
                    break
                }
                const condition: Condition | undefined =
                    NOVEL.sceneConditions[choice.bulbScene]
                if (!condition) {
                    possibleIndex = i
                    break
                }
                if (condition.getCondition()) {
                    possibleIndex = i
                    break
                }
            }
            NOVEL.echo.focusedChoiceIndex = possibleIndex
        })

        // left and right are the same while there is only two columns
        const left_right_the_same = () => {
            if (
                this.echo.focus.columnIndex === 0 &&
                right_column_length - 1 >= this.echo.focus.rowIndex
            ) {
                this.echo.focus.columnIndex = 1
            } else if (
                this.echo.focus.columnIndex === 1 &&
                left_column_length - 1 >= this.echo.focus.rowIndex
            ) {
                this.echo.focus.columnIndex = 0
            }
        }
        EVENTS.onSingle("go left", left_right_the_same)
        EVENTS.onSingle("go right", left_right_the_same)
        EVENTS.onSingle("go down", () => {
            this.echo.focus.rowIndex++
            if (this.echo.focus.rowIndex > max_setting_index) {
                this.echo.focus.rowIndex = 0
            }
        })
        EVENTS.onSingle("go up", () => {
            this.echo.focus.rowIndex--
            if (this.echo.focus.rowIndex < 0) {
                this.echo.focus.rowIndex = max_setting_index
            }
        })

        EVENTS.onSingle("switch tab left", () => {
            if (CONTEXT.echo.settings || !SETTINGS.editHotkeyMode) {
                this.echo.show_message = ""
                TIME.cancel(show_message_time_token)
                const last = SETTINGS.context_list.length - 1
                let i = SETTINGS.context_index - 1
                if (i < 0) i = last
                const context = SETTINGS.context_list[i]
                CONTEXT.echo.settings = context
                SETTINGS.last_opened = context
            }
        })
        EVENTS.onSingle("switch tab right", () => {
            if (CONTEXT.echo.settings || !SETTINGS.editHotkeyMode) {
                this.echo.show_message = ""
                TIME.cancel(show_message_time_token)
                const last = SETTINGS.context_list.length - 1
                let i = SETTINGS.context_index + 1
                if (i > last) i = 0
                const context = SETTINGS.context_list[i]
                CONTEXT.echo.settings = context
                SETTINGS.last_opened = context
            }
        })
        EVENTS.onSingle("resolve setting action", () => {
            if (!CONTEXT.echo.settings) return
            let column = "left_column"
            const columnIndex = SETTINGS.echo.focus.columnIndex
            const rowIndex = SETTINGS.echo.focus.rowIndex
            if (columnIndex === 1) column = "right_column"
            const device = this.context
            if (!device || (device !== "keyboard" && device !== "gamepad"))
                return
            const setting = SETTINGS[device + "_tab"]
            if (!setting) return
            const key_of_row = _.keys(setting[column])[rowIndex]
            const action = setting[column][key_of_row]
            if (!action) return
            if (action.type === "button") {
                EVENTS.emitSingle(action.event)
                SETTINGS.echo.button_pressed = true
                TIME.after(300, () => {
                    SETTINGS.echo.button_pressed = false
                })
            } else {
                if (
                    this.context === "keyboard" &&
                    INPUT.lastActiveDevice === "gamepad"
                ) {
                    this.echo.show_message =
                        "Please use keyboard to edit keyboard hotkeys."
                    TIME.cancel(show_message_time_token)
                    show_message_time_token = TIME.after(
                        5000,
                        () => (this.echo.show_message = "")
                    )
                } else {
                    SETTINGS.echo.editHotkeyMode = true
                }
            }
        })
    }
    emitEvents() {
        if (LIBRARY.deadZoneExceed(this.inputOther.gamepad.deadZone, INPUT)) {
            EVENTS.emitSingle("gamepadMove")
        }
        if (INTERFACE.inputFocus) return
        // 📜 why do we need check last here?? some order of events or smth i guess
        if (CONTEXT.echo.novel || CONTEXT.last.echo.novel) {
            _.forEach(this.novelInputEvents, (settingList, device) => {
                _.forEach(settingList, (button, setting) => {
                    if (INPUT[device].justPressed.includes(button)) {
                        EVENTS.emitSingle(setting)
                    }
                })
            })
            // overwrite default
            if (
                INPUT.keyboard.pressed.includes(
                    this.novelInputEvents.keyboard.continue
                ) ||
                INPUT.gamepad.pressed.includes(
                    this.novelInputEvents.gamepad.continue
                )
            ) {
                EVENTS.emitSingle("continue")
            }
        }
        if (CONTEXT.echo.interface || CONTEXT.last.echo.interface) {
            _.forEach(this.interfaceInputEvents, (settingList, device) => {
                _.forEach(settingList, (button, setting) => {
                    if (INPUT[device].justPressed.includes(button)) {
                        EVENTS.emitSingle(setting)
                    }
                })
            })
        }
        if (CONTEXT.echo.gameplay || CONTEXT.last.echo.gameplay) {
            _.forEach(this.worldInputEvents, (settingList, device) => {
                _.forEach(settingList, (button, setting) => {
                    if (INPUT[device].justPressed.includes(button)) {
                        EVENTS.emitSingle(setting)
                    }
                })
            })
            // overwrite default
            if (
                INPUT.mouse.pressed.includes(this.worldInputEvents.mouse.decide)
                // INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.decide)
            ) {
                if (!GLOBAL.firstUserGesture) return
                if (LOOP.elapsed > GLOBAL.sceneContextChangedMS + 500) {
                    EVENTS.emitSingle("decide")
                    GLOBAL.autoMove = false
                }
            }
            if (
                INPUT.gamepad.pressed.includes(
                    this.worldInputEvents.gamepad.cast1
                ) ||
                INPUT.keyboard.pressed.includes(
                    this.worldInputEvents.keyboard.cast1
                )
            ) {
                if (LOOP.elapsed > GLOBAL.sceneContextChangedMS + 500) {
                    EVENTS.emitSingle("cast1")
                }
            }
            if (
                INPUT.gamepad.pressed.includes(
                    this.worldInputEvents.gamepad.cast2
                ) ||
                INPUT.keyboard.pressed.includes(
                    this.worldInputEvents.keyboard.cast2
                )
            ) {
                EVENTS.emitSingle("cast2")
            }
            if (
                INPUT.gamepad.pressed.includes(
                    this.worldInputEvents.gamepad.cast3
                ) ||
                INPUT.keyboard.pressed.includes(
                    this.worldInputEvents.keyboard.cast3
                )
            ) {
                EVENTS.emitSingle("cast3")
            }
            if (GLOBAL.lastActiveDevice === "gamepad") GLOBAL.autoMove = false
        }
    }
}
export const SETTINGS = LIBRARY.resonate(new Settings())
