class guki_lib {
    toggle(object, prop) {
        object[prop] = !object[prop]
    }
    just_on(module, prop_path) {
        if (!module.last) return
        const { last_v, v } = this.get_values(module, prop_path)
        return !last_v && v
    }
    just_off(module, prop_path) {
        if (!module.last) return
        const { last_v, v } = this.get_values(module, prop_path)
        return last_v && !v
    }
    private get_values(module, prop_path) {
        const props = prop_path.split(".")
        const last_v = props.reduce(
            (acc, prop) => acc && acc[prop],
            module.last
        )
        const v = props.reduce((acc, prop) => acc && acc[prop], module)
        return { last_v, v }
    }
}
export const g = new guki_lib()
