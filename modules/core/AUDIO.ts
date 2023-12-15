import { Howl, Howler } from "howler"
type AudioObject = { [Token: string]: Howl }
const sound_amplifier = 1.5
const music_amplifier = 1.4
const silence_time = 40 // average silence between music at world.gameplay
let world_welcome_music_played = false
let novel_welcome_music_played = false
let music: Howl | undefined = undefined
const sounds: AudioObject = {}
let river: Token | undefined = undefined
let river_time_token: Token | undefined = undefined
const river_distance_close = 500
const river_distance_far = 1300
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
type Echo = { state: AudioContextState }
class Audio {
    echo: Echo = { state: "suspended" }
    async init() {
        EVENTS.onSingle("root game state changed", () => {
            this.stop_music()
            novel_welcome_music_played = false
            if (river && sounds[river]) {
                this.stop_loop_sound(river)
                river = undefined
            }
        })
    }
    process() {
        this.echo.state = Howler.ctx?.state || "suspended"

        // 📜 run only when settings change, and even then mb throttle
        // if (music) music.volume(SETTINGS.general.music * music_amplifier)
        // _.values(sounds).forEach((sound) => {
        //     sound.volume(SETTINGS.general.music * music_amplifier)
        // })

        // play music
        if (!music && GAME_STATE.echo.world) {
            // 📜 green-forest -> actual location
            if (!world_welcome_music_played) {
                TIME.next(() => this.play_music("green-forest-1"))
                world_welcome_music_played = true
            } else if (Math.random() < (1 / silence_time) * LOOP.delta_sec) {
                this.play_music("green-forest")
            }
        }
        if (!music && GAME_STATE.echo.novel && NOVEL.echo.active_girl) {
            if (!novel_welcome_music_played) {
                this.play_music(NOVEL.echo.active_girl + "-1")
                novel_welcome_music_played = true
            } else {
                this.play_music(NOVEL.echo.active_girl)
            }
        }

        // river sound
        if (GAME_STATE.echo.world && !river) {
            river = this.play_loop_sound("river")
            river_time_token = TIME.throttle_iterations(30, () => {
                if (!river && river_time_token) TIME.cancel(river_time_token)
                if (!river || !sounds[river]) return
                let volume = 0
                let current_min = Infinity
                river_positions.forEach((position) => {
                    const distance = COORD.distance_to_hero(position)
                    if (distance < current_min) current_min = distance
                })
                current_min -= river_distance_close
                if (current_min < 0) current_min = 0
                const max_volume = SETTINGS.general.sound * sound_amplifier
                volume = max_volume - current_min / river_distance_far
                if (volume < 0) volume = 0
                sounds[river].volume(volume)
            })
        }
    }
    private pick_audio(name: string) {
        const matches: string[] = []
        _.keys(ASSETS.mp3_paths).forEach((mp3_file_name) => {
            if (mp3_file_name.startsWith(name)) matches.push(mp3_file_name)
        })
        return _.sample(matches)
    }
    play_music(name: string) {
        const picked_file_name = this.pick_audio(name)
        if (!picked_file_name) return
        const options = {
            src: [ASSETS.mp3_paths[picked_file_name]],
            format: ["mp3"],
            volume: SETTINGS.general.music * music_amplifier,
            autoplay: true,
        }
        if (music) {
            this.stop_music()
            TIME.after(1100, () => (music = new Howl(options)))
        } else {
            music = new Howl(options)
        }
    }
    play_loop_sound = (name: string) => this._play_sound(name, true)
    play_sound = (name: string) => this._play_sound(name, false)
    private _play_sound(name: string, loop: boolean): Token | undefined {
        const picked_file_name = this.pick_audio(name)
        if (!picked_file_name) return
        const options = {
            src: [ASSETS.mp3_paths[picked_file_name]],
            format: ["mp3"],
            volume: SETTINGS.general.sound * sound_amplifier,
            autoplay: true,
            loop: loop,
        }
        const token = UNIQUE.string()
        sounds[token] = new Howl(options)
        // "end" hook doesn't trigger with autoplay
        sounds[token].on("end", () => delete sounds[token])
        if (loop) sounds[token].fade(0, sounds[token].volume(), 1000)
        return token
    }
    stop_music() {
        if (!music) return
        music.fade(music.volume(), 0, 1000)
        TIME.after(1000, () => {
            if (music) {
                music.stop()
                music = undefined
            }
        })
    }
    stop_loop_sound(token: Token) {
        if (!sounds[token]) return
        sounds[token].fade(sounds[token].volume(), 0, 1000)
        TIME.after(1000, () => {
            if (sounds[token]) {
                sounds[token].stop()
                delete sounds[token]
            }
        })
    }
}
export const AUDIO = LIBRARY.resonate(new Audio())
