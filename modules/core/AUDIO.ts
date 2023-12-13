type AudioType = "sound" | "music"
type Echo = { state: AudioContextState }
const sound_amplifier = 1.5
const music_amplifier = 1.4
const average_silence_seconds = 40 // between music at world.gameplay

let context: AudioContext | undefined = undefined
const buffers: { [key: string]: AudioBuffer } = {}
const sources: { [key: string]: AudioBufferSourceNode } = {}
let sound_node: GainNode | undefined = undefined
let music_node: GainNode | undefined = undefined

let active_music_token: Token | undefined = undefined
let world_welcome_music_played = false
let novel_welcome_music_played = false
const close_mobs: Entity[] = []
const mobs_sounds_tokens: Token[] = []

type LoopSoundsTokensObject = { [mp3_file_name: string]: TokensObject }
type TokensObject = {
    sound: (Token | undefined)[]
    time: (Token | undefined)[]
}
let loop_sounds_tokens: LoopSoundsTokensObject = {}

const river_positions: Position[] = [
    { x: 7166, y: 7133 },
    { x: 7424, y: 7163 },
    { x: 7638, y: 6955 },
    { x: 7840, y: 6695 },
    { x: 7956, y: 6431 },
    { x: 8005, y: 6169 },
    { x: 8177, y: 5931 },
    { x: 8226, y: 5701 },
    { x: 6897, y: 7555 },
    { x: 6695, y: 7731 },
    { x: 6484, y: 7870 },
    { x: 6230, y: 7955 },
    { x: 5959, y: 8017 },
]
class Audio {
    echo: Echo = { state: "suspended" }
    async init() {
        context = new AudioContext()
        sound_node = context.createGain()
        music_node = context.createGain()
        sound_node.connect(context.destination)
        music_node.connect(context.destination)
        for (const [mp3_file_name, mp3_path] of _.entries(ASSETS.mp3_paths)) {
            const response = await fetch(mp3_path)
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await context.decodeAudioData(arrayBuffer)
            buffers[mp3_file_name] = audioBuffer
        }
        EVENTS.onSingle("root game state changed", () => {
            this.stop_music()
            novel_welcome_music_played = false
            mobs_sounds_tokens.forEach((token) => this.stop_sound(token))
            this.stop_loop_sound("river")
        })
    }
    process() {
        if (!context || !sound_node || !music_node) return
        sound_node.gain.value = SETTINGS.general.sound * sound_amplifier
        music_node.gain.value = SETTINGS.general.music * music_amplifier
        this.echo.state = context.state

        // update close mobs
        if (GAME_STATE.echo.world && LOOP.new_second_just_began) {
            MUSEUM.process_entity("MOB", (entity) => {
                if (COORD.distance_to_hero(entity.POSITION) < 1500) {
                    close_mobs.push(entity)
                }
            })
        }
        // play music
        if (GAME_STATE.echo.world && !active_music_token) {
            if (!world_welcome_music_played) {
                // 📜 make green-forest-1 -> actual location
                TIME.run_next_iteration(() => {
                    active_music_token = this.play_music("green-forest-1")
                })
                world_welcome_music_played = true
            } else if (
                Math.random() <
                (1 / average_silence_seconds) * LOOP.delta_sec
            ) {
                active_music_token = this.play_music("green-forest")
            }
        } else if (
            GAME_STATE.echo.novel &&
            NOVEL.echo.active_girl &&
            !active_music_token
        ) {
            if (!novel_welcome_music_played) {
                active_music_token = this.play_music(
                    NOVEL.echo.active_girl + "-1"
                )
                novel_welcome_music_played = true
            } else {
                active_music_token = this.play_music(NOVEL.echo.active_girl)
            }
        }
        // play idle mobs sounds
        // if (GAME_STATE.echo.world) {
        //     close_mobs.forEach((mob) => {
        //         if (
        //             mob.STATE.active === "idle" &&
        //             Math.random() < 0.3 * LOOP.delta_sec
        //         ) {
        //             const sound_token = this.play_sound(mob.name + "-idle")
        //             if (sound_token) mobs_sounds_tokens.push(sound_token)
        //         }
        //         // 📜 add move state ?
        //     })
        // }
        // play river sound
        if (GAME_STATE.echo.world && !loop_sounds_tokens.river) {
            this.play_loop_sound("river")
        }
    }
    play_loop_sound = (name: string) => {
        const sound_duration = 60_000 // 🌱 change this line to resolve sound duration form name using buffer, you can get it as in play function
        const loop_duration = sound_duration - 750
        const tokens: TokensObject = {
            sound: [undefined, undefined],
            time: [undefined, undefined],
        }
        tokens.time[0] = TIME.unbound_every(loop_duration * 2, () => {
            const token = this.play(name, 0, "sound")
            tokens.sound[0] = token
        })
        tokens.time[1] = TIME.run_after(loop_duration, () => {
            tokens.time[1] = TIME.unbound_every(loop_duration * 2, () => {
                const token = this.play(name, 0, "sound")
                tokens.sound[1] = token
            })
        })
        loop_sounds_tokens[name] = tokens
    }
    stop_loop_sound = (name: string, fade_duration = 500) => {
        const tokens: TokensObject = loop_sounds_tokens[name]
        if (tokens.time[0]) TIME.cancel(tokens.time[0])
        if (tokens.time[1]) TIME.cancel(tokens.time[1])
        if (tokens.sound[0]) this.stop_sound(tokens.sound[0], fade_duration)
        if (tokens.sound[1]) this.stop_sound(tokens.sound[1], fade_duration)
        delete loop_sounds_tokens[name]
    }
    play_music = (name: string, delay = 0) => this.play(name, delay, "music")
    play_sound = (name: string, delay = 0) => this.play(name, delay, "sound")
    private play(name: string, delay: number, type: AudioType) {
        if (!context || !sound_node || !music_node) return
        if (type === "music" && active_music_token) return
        const matching_buffers = _.filter(buffers, (buffer, key) =>
            key.includes(name)
        )
        if (_.isEmpty(matching_buffers)) return
        const source = context.createBufferSource()
        const buffer = _.sample(matching_buffers)
        if (!buffer) return
        source.buffer = buffer
        let parent_node = type === "music" ? music_node : sound_node
        source.connect(parent_node)
        const token = UNIQUE.string()
        sources[token] = source
        source.onended = () => {
            delete sources[token]
            if (type === "music") active_music_token = undefined
        }
        source.start(context.currentTime + delay / 1000)
        return token
    }
    stop_music() {
        if (active_music_token) this.stop(active_music_token, 1000, "music")
    }
    stop_sound(token: string, fade_duration = 100) {
        this.stop(token, fade_duration, "sound")
    }
    private stop(token: string, fade_duration: number, type: AudioType) {
        if (!context || !sound_node || !music_node) return
        if (!sources[token]) return
        const node = context.createGain()
        let parent_node = type === "music" ? music_node : sound_node
        sources[token].disconnect(parent_node)
        sources[token].connect(node)
        node.connect(parent_node)
        let volume = 0
        if (type === "music") volume = SETTINGS.general.music
        if (type === "sound") volume = SETTINGS.general.sound
        let end_time = context.currentTime + fade_duration / 1000
        node.gain.setValueAtTime(volume, context.currentTime)
        node.gain.linearRampToValueAtTime(0, end_time)
        sources[token].stop(end_time)
        delete sources[token]
    }
}

export const AUDIO = LIBRARY.resonate(new Audio())
