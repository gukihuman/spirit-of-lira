type AudioType = "sound" | "music"
type Echo = { state: AudioContextState }
const sound_amplifier = 1.5
const music_amplifier = 1.4
const average_silence_sec = 40 // between music in world gameplay
class Audio {
    private context: AudioContext | null = null
    private sound_gain: GainNode | null = null
    private music_gain: GainNode | null = null
    private audioBuffers: { [key: string]: AudioBuffer } = {}
    private sources: { [key: string]: AudioBufferSourceNode } = {}
    private musicPlaying = false
    private initialMusicPlayed = false
    private initialN1MusicPlayed = false
    private allIdleIds: string[] = []
    currentMusicId
    scene_name = ""
    last_check = ["scene_name"] // do some type check with last together
    last: AnyObject = {}
    async init() {
        this.context = new AudioContext()
        this.sound_gain = this.context.createGain()
        this.sound_gain.connect(this.context.destination)
        this.music_gain = this.context.createGain()
        this.music_gain.connect(this.context.destination)
        for (const name in ASSETS.audios) {
            const response = await fetch(ASSETS.audios[name])
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
            this.audioBuffers[name] = audioBuffer
        }
        EVENTS.onSingle("sceneContextChanged", () => {
            this.stop(this.currentMusicId, 1000, "music")
            this.musicPlaying = false
            this.initialN1MusicPlayed = false

            this.allIdleIds.forEach((id) => this.stop(id))
            this.allIdleIds = []
        })
    }

    river_positions: Position[] = [
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
    startIdleMobs() {
        if (!GAME_STATE.echo.world) return
        MUSEUM.processEntity(["NONHERO", "MOVE"], (entity, id) => {
            if (COORD.distance(entity.POSITION, SH.hero.POSITION) > 1500) return
            if (Math.random() > 0.5 * LOOP.delta_sec) return
            // 📜 mb add move state :)
            if (entity.STATE.active === "idle") {
                const id = this.play(entity.name + "-idle")
                if (!id) return
                this.allIdleIds.push(id)
            }
        })
    }
    echo: Echo = { state: "suspended" }
    process() {
        if (!this.context || !this.sound_gain || !this.music_gain) return

        this.echo.state = this.context.state
        this.scene_name = SCENE_ACTIVE.name
        const scene_name = this.scene_name.split("-")[0] // n0 | n1 | b0 ...
        const lastSceneName = this.last.scene_name.split("-")[0]
        if (scene_name === "n1" && lastSceneName !== "n1") {
            this.stop(this.currentMusicId, 1000, "music")
        }

        if (!LOOP.new_sec) return
        this.startIdleMobs()
        this.sound_gain.gain.value = SETTINGS.general.sound * sound_amplifier
        this.music_gain.gain.value = SETTINGS.general.music * music_amplifier
        if (!this.musicPlaying && GAME_STATE.echo.world) {
            if (!this.initialMusicPlayed) {
                this.currentMusicId = this.play("green-forest-1", 0, "music")
                if (this.currentMusicId) this.initialMusicPlayed = true
                return
            }
            if (Math.random() > 1 / average_silence_sec) return // once per second
            this.currentMusicId = this.play("green-forest", 0, "music")
        }
        if (!this.musicPlaying && GAME_STATE.echo.scene) {
            if (scene_name === "n1") {
                if (!this.initialN1MusicPlayed) {
                    this.currentMusicId = this.play("n-1", 0, "music")
                    if (this.currentMusicId) this.initialN1MusicPlayed = true
                    return
                } else {
                    this.currentMusicId = this.play("n-2", 0, "music")
                    return
                }
            }
            if (_.startsWith(scene_name, "n")) {
                this.currentMusicId = this.play("n-2", 0, "music")
                return
            }
            this.currentMusicId = this.play(scene_name, 0, "music")
        }
    }
    play(name, delay = 0, type: AudioType = "sound") {
        if (!this.context || !this.sound_gain || !this.music_gain) return

        const matching_buffers = _.filter(this.audioBuffers, (buffer, key) =>
            key.includes(name)
        )
        if (_.isEmpty(matching_buffers)) return
        if (type === "music" && this.currentMusicId) return
        if (type === "music") this.musicPlaying = true
        const source = this.context.createBufferSource()
        const buffer = _.sample(matching_buffers)
        if (!buffer) return
        source.buffer = buffer
        if (type === "sound") {
            source.connect(this.sound_gain)
        } else if (type === "music") {
            source.connect(this.music_gain)
        }
        const id = UNIQUE.string()
        this.sources[id] = source
        source.onended = () => delete this.sources[id]
        if (type === "music")
            source.onended = () => {
                this.currentMusicId = undefined
                this.musicPlaying = false
            }
        source.start(this.context.currentTime + delay / 1000) // Add delay
        return id
    }
    stop(id, fadeDuration = 100, type = "sound") {
        if (!this.sources[id]) return
        const gainNode = this.context.createGain()
        if (type === "sound") this.sources[id].disconnect(this.sound_gain)
        else if (type === "music") this.sources[id].disconnect(this.music_gain)
        this.sources[id].connect(gainNode)
        let parentGain
        if (type === "sound") parentGain = this.sound_gain
        else if (type === "music") parentGain = this.music_gain
        gainNode.connect(parentGain)
        let volume
        if (type === "sound") volume = SETTINGS.general.sound
        else if (type === "music") volume = SETTINGS.general.music
        gainNode.gain.setValueAtTime(volume, this.context.currentTime)
        gainNode.gain.linearRampToValueAtTime(
            0,
            this.context.currentTime + fadeDuration / 1000
        )
        this.sources[id].stop(this.context.currentTime + fadeDuration / 1000)
        delete this.sources[id]
    }
}

export const AUDIO = LIBRARY.resonate(new Audio())
