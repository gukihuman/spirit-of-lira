import { Howl, Howler } from "howler"
type AudioObject = { [Token: string]: Howl }
const sound_amplifier = 1.5
const music_amplifier = 1.3
const silence_time = 50 // average silence between music at world.gameplay
let world_welcome_music_played = false
let novel_welcome_music_played = false
let music: Howl | undefined = undefined
const sounds: AudioObject = {}
let river_token: Token | undefined = undefined
let river_time_token: Token | undefined = undefined
const river_distance_close = 500
const river_distance_far = 1500
let river_volume = 0
const river_pos: Position[] = [
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
        EVENTS.onSingle("novel context changed", () => {
            this.stop_music()
            novel_welcome_music_played = false
            if (river_token && sounds[river_token]) {
                this.stop_loop_sound(river_token)
                river_token = undefined
            }
        })
    }
    update_volume() {
        if (music) music.volume(SETTINGS.echo.general.music * music_amplifier)
        _.values(sounds).forEach((sound) => {
            sound.volume(SETTINGS.echo.general.sound * sound_amplifier)
        })
        if (river_token && sounds[river_token]) {
            sounds[river_token].volume(river_volume)
        }
    }
    process() {
        this.echo.state = Howler.ctx?.state || "suspended"

        // play music
        if (!music && !CONTEXT.echo.novel && !CONTEXT.echo.empty) {
            // 📜 green-forest -> actual location
            if (!world_welcome_music_played) {
                TIME.next(() => this.play_music("green-forest-1"))
                world_welcome_music_played = true
            } else if (Math.random() < (1 / silence_time) * LOOP.delta_sec) {
                this.play_music("green-forest")
            }
        }
        if (!music && CONTEXT.echo.novel && NOVEL.echo.active_girl) {
            if (!novel_welcome_music_played) {
                this.play_music(NOVEL.echo.active_girl + "-1")
                novel_welcome_music_played = true
            } else {
                this.play_music(NOVEL.echo.active_girl)
            }
        }

        // river_token sound
        if (LOOP.iterations > 30 && CONTEXT.echo.world && !river_token) {
            river_token = this.play_loop_sound("river")
            river_time_token = TIME.throttle_iterations(5, () => {
                if (!river_token && river_time_token)
                    TIME.cancel(river_time_token)
                if (!river_token || !sounds[river_token]) return
                let distance = Infinity
                river_pos.forEach((POS) => {
                    const d = COORD.distance_to_hero(POS)
                    if (d < distance) distance = d
                })
                distance -= river_distance_close
                if (distance < 0) distance = 0
                const sound_ratio =
                    SETTINGS.echo.general.sound * sound_amplifier
                let distance_volume_ratio =
                    1 - distance / (river_distance_far - river_distance_close)
                if (distance_volume_ratio < 0) distance_volume_ratio = 0
                let volume = distance_volume_ratio * sound_ratio
                river_volume = volume
                if (volume < 0) volume = 0
                sounds[river_token].volume(volume)
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
            volume: SETTINGS.echo.general.music * music_amplifier,
            autoplay: true,
        }
        if (music) {
            this.stop_music()
            TIME.after(1100, () => {
                music = new Howl(options)
                music.on("end", () => (music = undefined))
            })
        } else {
            music = new Howl(options)
            music.on("end", () => (music = undefined))
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
            volume: SETTINGS.echo.general.sound * sound_amplifier,
            autoplay: true,
            loop: loop,
        }
        const token = UNIQUE.string()
        sounds[token] = new Howl(options)
        // "end" hook doesn't trigger with autoplay
        if (!loop) sounds[token].on("end", () => delete sounds[token])
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
