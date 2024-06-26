const global = {
    version: "v0.1.0",
    gameWindowScale: 1,
    fullscreen: false,
    reset: false,
    dev_env: false,
    editMode: false,
    collision: true,
    firstMouseMove: false,
    autoMove: false,
    sceneContextChangedMS: 0,
    firstUserGesture: false,
    mouseOfScreen: { x: -30, y: -30 },
    mouse_pos: { x: -30, y: -30 },
    hoverId: undefined,
    lastActiveDevice: "keyboard",
    elapsed: 0,
    process() {
        this.elapsed = LOOP.elapsed
        this.mouseOfScreen = COORD.mouseOfScreen()
        this.mouse_pos = COORD.mouse
    },
}

export const GLOBAL = LIBRARY.resonateObject(global)
