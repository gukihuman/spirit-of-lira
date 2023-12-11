type FnsToRunFor = {
    [key: string]: { fn: Function; time_to_remove: number }
}
type FnsToRunForIterations = {
    [key: string]: { fn: Function; iterations_to_remove: number }
}
type FnsToRunAfter = {
    [key: string]: { fn: Function; time_to_run: number }
}
type FnsToRunAfterIterations = {
    [key: string]: { fn: Function; iterations_to_run: number }
}
class Time {
    cancel(fn_id: string) {
        delete this.fns_to_run_for[fn_id]
        delete this.fns_to_run_for_iterations[fn_id]
        delete this.fns_to_run_after[fn_id]
        delete this.fns_to_run_after_iterations[fn_id]
    }
    private fns_to_run_for: FnsToRunFor = {}
    run_for(fn: Function, time_to_run: number) {
        const fn_id = UNIQUE.string()
        const time_to_remove = LOOP.elapsed + time_to_run
        this.fns_to_run_for[fn_id] = { fn, time_to_remove }
        return fn_id
    }
    private fns_to_run_for_iterations: FnsToRunForIterations = {}
    run_for_iterations(fn: Function, iterations_to_run = 1) {
        const fn_id = UNIQUE.string()
        const iterations_to_remove = LOOP.iterations + iterations_to_run
        this.fns_to_run_for_iterations[fn_id] = { fn, iterations_to_remove }
        return fn_id
    }
    private fns_to_run_after: FnsToRunAfter = {}
    run_after(fn: Function, time: number) {
        const fn_id = UNIQUE.string()
        const time_to_run = LOOP.elapsed + time
        this.fns_to_run_after[fn_id] = { fn, time_to_run }
        return fn_id
    }
    private fns_to_run_after_iterations: FnsToRunAfterIterations = {}
    run_after_iterations(fn: Function, iterations = 1) {
        const fn_id = UNIQUE.string()
        const iterations_to_run = LOOP.iterations + iterations
        this.fns_to_run_after_iterations[fn_id] = { fn, iterations_to_run }
        return fn_id
    }
    process() {
        _.entries(this.fns_to_run_for).forEach(
            ([fn_id, { fn, time_to_remove }]) => {
                fn()
                if (LOOP.elapsed >= time_to_remove) {
                    delete this.fns_to_run_for[fn_id]
                }
            }
        )
        _.entries(this.fns_to_run_for_iterations).forEach(
            ([fn_id, { fn, iterations_to_remove }]) => {
                fn()
                if (LOOP.iterations >= iterations_to_remove) {
                    delete this.fns_to_run_for_iterations[fn_id]
                }
            }
        )
        _.entries(this.fns_to_run_after).forEach(
            ([fn_id, { fn, time_to_run }]) => {
                if (LOOP.elapsed >= time_to_run) {
                    fn()
                    delete this.fns_to_run_after[fn_id]
                }
            }
        )
        _.entries(this.fns_to_run_after_iterations).forEach(
            ([fn_id, { fn, iterations_to_run }]) => {
                if (LOOP.iterations >= iterations_to_run) {
                    fn()
                    delete this.fns_to_run_after_iterations[fn_id]
                }
            }
        )
    }
}
export const TIME = new Time()
