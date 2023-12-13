type FnsToRunFor = {
    [token: string]: {
        fn: Function
        time_to_remove: number
    }
}
type FnsToRunForIterations = {
    [token: string]: {
        fn: Function
        iterations_to_remove: number
    }
}
type FnsToRunAfter = {
    [token: string]: {
        fn: Function
        time_to_run: number
    }
}
type FnsToRunAfterIterations = {
    [token: string]: {
        fn: Function
        iterations_to_run: number
    }
}
type FnsToRunEvery = {
    [token: string]: {
        fn: Function
        time_to_run: number
        time_period: number
    }
}
type FnsToRunEveryIterations = {
    [token: string]: {
        fn: Function
        iterations_to_run: number
        iterations_period: number
    }
}
class Time {
    cancel(token: string) {
        delete this.fns_to_run_for[token]
        delete this.fns_to_run_for_iterations[token]
        delete this.fns_to_run_after[token]
        delete this.fns_to_run_after_iterations[token]
        delete this.fns_to_run_every[token]
        delete this.fns_to_run_every_iterations[token]
        clearInterval(parseInt(token))
    }
    private fns_to_run_for: FnsToRunFor = {}
    run_for(time_to_run: number, fn: Function) {
        const token = UNIQUE.string()
        const time_to_remove = LOOP.elapsed + time_to_run
        this.fns_to_run_for[token] = { fn, time_to_remove }
        return token
    }
    private fns_to_run_for_iterations: FnsToRunForIterations = {}
    run_for_iterations(iterations_to_run: number, fn: Function) {
        const token = UNIQUE.string()
        const iterations_to_remove = LOOP.iterations + iterations_to_run
        this.fns_to_run_for_iterations[token] = { fn, iterations_to_remove }
        return token
    }
    private fns_to_run_after: FnsToRunAfter = {}
    run_after(time: number, fn: Function) {
        const token = UNIQUE.string()
        const time_to_run = LOOP.elapsed + time
        this.fns_to_run_after[token] = { fn, time_to_run }
        return token
    }
    private fns_to_run_after_iterations: FnsToRunAfterIterations = {}
    run_after_iterations(iterations: number, fn: Function) {
        const token = UNIQUE.string()
        const iterations_to_run = LOOP.iterations + iterations
        this.fns_to_run_after_iterations[token] = { fn, iterations_to_run }
        return token
    }
    run_next_iteration = (fn: Function) => this.run_after_iterations(1, fn)
    private fns_to_run_every: FnsToRunEvery = {}
    run_every(time_period: number, fn: Function) {
        const token = UNIQUE.string()
        const time_to_run = LOOP.elapsed
        this.fns_to_run_every[token] = { fn, time_to_run, time_period }
        return token
    }
    unbound_every(time_period: number, fn: Function) {
        fn()
        return setInterval(fn, time_period).toString()
    }
    private fns_to_run_every_iterations: FnsToRunEveryIterations = {}
    run_every_iterations(iterations_period: number, fn: Function) {
        const token = UNIQUE.string()
        const iterations_to_run = LOOP.iterations
        this.fns_to_run_every_iterations[token] = {
            fn,
            iterations_to_run,
            iterations_period,
        }
        return token
    }
    process() {
        _.entries(this.fns_to_run_for).forEach(
            ([token, { fn, time_to_remove }]) => {
                fn()
                if (LOOP.elapsed >= time_to_remove) {
                    delete this.fns_to_run_for[token]
                }
            }
        )
        _.entries(this.fns_to_run_for_iterations).forEach(
            ([token, { fn, iterations_to_remove }]) => {
                fn()
                if (LOOP.iterations >= iterations_to_remove) {
                    delete this.fns_to_run_for_iterations[token]
                }
            }
        )
        _.entries(this.fns_to_run_after).forEach(
            ([token, { fn, time_to_run }]) => {
                if (LOOP.elapsed >= time_to_run) {
                    fn()
                    delete this.fns_to_run_after[token]
                }
            }
        )
        _.entries(this.fns_to_run_after_iterations).forEach(
            ([token, { fn, iterations_to_run }]) => {
                if (LOOP.iterations >= iterations_to_run) {
                    fn()
                    delete this.fns_to_run_after_iterations[token]
                }
            }
        )
        _.entries(this.fns_to_run_every).forEach(
            ([token, { fn, time_to_run, time_period }]) => {
                if (LOOP.elapsed >= time_to_run) {
                    fn()
                    this.fns_to_run_every[token].time_to_run += time_period
                }
            }
        )
        _.entries(this.fns_to_run_every_iterations).forEach(
            ([token, { fn, iterations_to_run, iterations_period }]) => {
                if (LOOP.iterations >= iterations_to_run) {
                    fn()
                    this.fns_to_run_every_iterations[token].iterations_to_run +=
                        iterations_period
                }
            }
        )
    }
}
export const TIME = new Time()
