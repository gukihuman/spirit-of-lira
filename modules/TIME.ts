type FnsUntil = {
    [token: string]: {
        fn: Function
        time_to_remove: number
    }
}
type FnsUntilIterations = {
    [token: string]: {
        fn: Function
        iterations_to_remove: number
    }
}
type FnsAfter = {
    [token: string]: {
        fn: Function
        time_to_run: number
    }
}
type FnsAfterIterations = {
    [token: string]: {
        fn: Function
        iterations_to_run: number
    }
}
type FnsEvery = {
    [token: string]: {
        fn: Function
        time_to_run: number
        time_period: number
    }
}
type FnsEveryIterations = {
    [token: string]: {
        fn: Function
        iterations_to_run: number
        iterations_period: number
    }
}
type FnsThrottleIterations = {
    [token: string]: {
        fn: Function
        iterations_period: number
        random: number
    }
}
class Time {
    cancel(token: string) {
        TIME.next(() => {
            delete this.fns_until[token]
            delete this.fns_until_iterations[token]
            delete this.fns_after[token]
            delete this.fns_after_iterations[token]
            delete this.fns_every[token]
            delete this.fns_every_iterations[token]
            delete this.fns_throttle_iterations[token]
            clearInterval(parseInt(token))
        })
    }
    private fns_until: FnsUntil = {}
    until(time_to_run: number, fn: Function) {
        const token = UNIQUE.string()
        const time_to_remove = LOOP.elapsed + time_to_run
        this.fns_until[token] = { fn, time_to_remove }
        return token
    }
    private fns_until_iterations: FnsUntilIterations = {}
    until_iterations(iterations_to_run: number, fn: Function) {
        const token = UNIQUE.string()
        const iterations_to_remove = LOOP.iterations + iterations_to_run
        this.fns_until_iterations[token] = { fn, iterations_to_remove }
        return token
    }
    private fns_after: FnsAfter = {}
    after(time: number, fn: Function) {
        const token = UNIQUE.string()
        const time_to_run = LOOP.elapsed + time
        this.fns_after[token] = { fn, time_to_run }
        return token
    }
    private fns_after_iterations: FnsAfterIterations = {}
    after_iterations(iterations: number, fn: Function) {
        const token = UNIQUE.string()
        const iterations_to_run = LOOP.iterations + iterations
        this.fns_after_iterations[token] = { fn, iterations_to_run }
        return token
    }
    /** run on next iteration */
    next = (fn: Function) => this.after_iterations(1, fn)
    private fns_every: FnsEvery = {}
    every(time_period: number, fn: Function) {
        const token = UNIQUE.string()
        const time_to_run = LOOP.elapsed
        this.fns_every[token] = { fn, time_to_run, time_period }
        return token
    }
    unbound_every(time_period: number, fn: Function) {
        fn()
        return setInterval(fn, time_period).toString()
    }
    private fns_every_iterations: FnsEveryIterations = {}
    every_iterations(iterations_period: number, fn: Function) {
        const token = UNIQUE.string()
        const iterations_to_run = LOOP.iterations
        this.fns_every_iterations[token] = {
            fn,
            iterations_to_run,
            iterations_period,
        }
        return token
    }
    private fns_throttle_iterations: FnsThrottleIterations = {}
    throttle_iterations(iterations_period: number, fn: Function) {
        const token = UNIQUE.string()
        const random = Math.floor(_.random(0, LOOP.fps))
        this.fns_throttle_iterations[token] = {
            fn,
            iterations_period,
            random,
        }
        return token
    }
    process() {
        _.entries(this.fns_until).forEach(([token, { fn, time_to_remove }]) => {
            fn()
            if (LOOP.elapsed >= time_to_remove) delete this.fns_until[token]
        })
        _.entries(this.fns_until_iterations).forEach(
            ([token, { fn, iterations_to_remove }]) => {
                fn()
                if (LOOP.iterations >= iterations_to_remove) {
                    delete this.fns_until_iterations[token]
                }
            }
        )
        _.entries(this.fns_after).forEach(([token, { fn, time_to_run }]) => {
            if (LOOP.elapsed >= time_to_run) {
                fn()
                delete this.fns_after[token]
            }
        })
        _.entries(this.fns_after_iterations).forEach(
            ([token, { fn, iterations_to_run }]) => {
                if (LOOP.iterations >= iterations_to_run) {
                    fn()
                    delete this.fns_after_iterations[token]
                }
            }
        )
        _.entries(this.fns_every).forEach(
            ([token, { fn, time_to_run, time_period }]) => {
                if (LOOP.elapsed >= time_to_run) {
                    fn()
                    this.fns_every[token].time_to_run += time_period
                }
            }
        )
        _.entries(this.fns_every_iterations).forEach(
            ([token, { fn, iterations_to_run, iterations_period }]) => {
                if (LOOP.iterations >= iterations_to_run) {
                    fn()
                    this.fns_every_iterations[token].iterations_to_run +=
                        iterations_period
                }
            }
        )
        _.entries(this.fns_throttle_iterations).forEach(
            ([token, { fn, iterations_period, random }]) => {
                if ((LOOP.iterations + random) % iterations_period === 0) fn()
            }
        )
    }
}
export const TIME = new Time()
