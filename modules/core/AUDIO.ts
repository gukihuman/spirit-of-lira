const soundAmplifier = 1.5
const musicAmplifier = 1.4
class Aud {
  private averageSilenceSec = 60
  private audioContext
  private audioBuffers: { [key: string]: AudioBuffer } = {}
  private audioSources: { [key: string]: AudioBufferSourceNode } = {}
  private idCounter = 0
  private soundGain
  private musicGain
  private musicPlaying = false
  private initialMusicPlayed = false
  private initialN1MusicPlayed = false
  private allIdleIds: string[] = []
  currentMusicId
  sceneName = ""
  lastCheck = ["sceneName"] // do some type check with last together
  last: AnyObject = {}
  async init() {
    this.audioContext = new AudioContext()
    this.soundGain = this.audioContext.createGain()
    this.soundGain.connect(this.audioContext.destination)
    this.musicGain = this.audioContext.createGain()
    this.musicGain.connect(this.audioContext.destination)
    for (const name in ASSETS.audios) {
      const response = await fetch(ASSETS.audios[name])
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.audioBuffers[name] = audioBuffer
    }
    EVENTS.onSingle("sceneContextChanged", () => {
      this.stop(this.currentMusicId, 1000, "music")
      this.musicPlaying = false
      this.initialN1MusicPlayed = false

      this.allIdleIds.forEach((id) => {
        this.stop(id)
      })
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
    if (!CONTEXT.echo.world) return
    MUSEUM.processEntity(["NONHERO", "MOVE"], (entity, id) => {
      if (COORD.distance(entity.POSITION, SH.hero.POSITION) > 1500) return
      if (Math.random() > 0.5 * LOOP.deltaSec) return
      // 📜 mb add move state :)
      if (entity.STATE.active === "idle") {
        const id = this.play(entity.name + "-idle")
        if (!id) return
        this.allIdleIds.push(id)
      }
    })
  }
  process() {
    this.sceneName = SCENE_ACTIVE.name
    const sceneName = this.sceneName.split("-")[0] // n0 | n1 | b0 ...
    const lastSceneName = this.last.sceneName.split("-")[0]
    if (sceneName === "n1" && lastSceneName !== "n1") {
      this.stop(this.currentMusicId, 1000, "music")
    }

    if (!LOOP.newSec) return
    this.startIdleMobs()
    if (this.audioContext.STATE === "suspended") {
      this.audioContext.resume()
    } else {
      GLOBAL.firstUserGesture = true // sometimes works so no need to gesture
    }
    this.soundGain.gain.value = SETTINGS.general.sound * soundAmplifier
    this.musicGain.gain.value = SETTINGS.general.music * musicAmplifier
    if (!this.musicPlaying && CONTEXT.echo.world) {
      if (!this.initialMusicPlayed) {
        this.currentMusicId = this.play("green-forest-1", 0, "music")
        if (this.currentMusicId) this.initialMusicPlayed = true
        return
      }
      if (Math.random() > 1 / this.averageSilenceSec) return // once per second
      this.currentMusicId = this.play("green-forest", 0, "music")
    }
    if (!this.musicPlaying && CONTEXT.echo.scene) {
      if (sceneName === "n1") {
        if (!this.initialN1MusicPlayed) {
          this.currentMusicId = this.play("n-1", 0, "music")
          if (this.currentMusicId) this.initialN1MusicPlayed = true
          return
        } else {
          this.currentMusicId = this.play("n-2", 0, "music")
          return
        }
      }
      if (_.startsWith(sceneName, "n")) {
        this.currentMusicId = this.play("n-2", 0, "music")
        return
      }
      this.currentMusicId = this.play(sceneName, 0, "music")
    }
  }
  play(name, delay = 0, type = "sound") {
    const matchingBuffers = _.filter(this.audioBuffers, (buffer, key) =>
      key.includes(name)
    )
    if (_.isEmpty(matchingBuffers)) return
    if (type === "music" && this.currentMusicId) return
    if (type === "music") this.musicPlaying = true
    const buffer = _.sample(matchingBuffers)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    if (type === "sound") {
      source.connect(this.soundGain)
    } else if (type === "music") {
      source.connect(this.musicGain)
    }
    const id = `${name}-${this.idCounter++}`
    this.audioSources[id] = source
    source.onended = () => delete this.audioSources[id]
    if (type === "music")
      source.onended = () => {
        this.currentMusicId = undefined
        this.musicPlaying = false
      }
    source.start(this.audioContext.currentTime + delay / 1000) // Add delay
    return id
  }
  stop(id, fadeDuration = 100, type = "sound") {
    if (!this.audioSources[id]) return
    const gainNode = this.audioContext.createGain()
    if (type === "sound") this.audioSources[id].disconnect(this.soundGain)
    else if (type === "music") this.audioSources[id].disconnect(this.musicGain)
    this.audioSources[id].connect(gainNode)
    let parentGain
    if (type === "sound") parentGain = this.soundGain
    else if (type === "music") parentGain = this.musicGain
    gainNode.connect(parentGain)
    let volume
    if (type === "sound") volume = SETTINGS.general.sound
    else if (type === "music") volume = SETTINGS.general.music
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + fadeDuration / 1000
    )
    this.audioSources[id].stop(
      this.audioContext.currentTime + fadeDuration / 1000
    )
    delete this.audioSources[id]
  }
}

export const AUDIO = new Aud()
