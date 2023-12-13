class La {
    process() {
        for (const name of CONFIG.modules) {
            const module = globalThis[name]
            if (!module.last) continue
            _.keys(module.last).forEach((key) => {
                if (key !== "echo") {
                    module.last[key] = LIBRARY.clone(module[key])
                } else {
                    const echo_keys = _.keys(module.echo)
                    module.last.echo = {}
                    echo_keys.forEach((echo_key) => {
                        // exclude '_pinia_store' property from cloning, it's a manually chosen echo property to save an internal reactive pinia store, those stores can not be cloned
                        if (echo_key === "_pinia_store") return
                        module.last.echo[echo_key] = LIBRARY.clone(
                            module.echo[echo_key]
                        )
                    })
                }
            })
        }
    }
}
export const LAST = new La()
