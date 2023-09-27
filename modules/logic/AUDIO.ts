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
  currentMusicId
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
  }
  process() {
    if (!WORLD.loop.newSec) return
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume()
    }
    this.soundGain.gain.value = SETTINGS.audio.sound
    this.musicGain.gain.value = SETTINGS.audio.music
    if (!this.musicPlaying) {
      if (!this.initialMusicPlayed) {
        // always 1 at start
        this.currentMusicId = this.play("green-forest-1", 0, "music")
        this.initialMusicPlayed = true
        this.musicPlaying = true
        return
      }
      if (Math.random() > 1 / this.averageSilenceSec) return // once per second
      this.currentMusicId = this.play("green-forest", 0, "music")
      this.musicPlaying = true
    }
  }
  play(name, delay = 0, type = "sound") {
    const matchingBuffers = _.filter(this.audioBuffers, (buffer, key) =>
      key.includes(name)
    )
    if (_.isEmpty(matchingBuffers)) return
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
    if (type === "music") source.onended = () => (this.musicPlaying = false)
    source.start(this.audioContext.currentTime + delay / 1000) // Add delay
    return id
  }
  stop(id, fadeDuration = 100, type = "sound") {
    if (!this.audioSources[id]) return
    console.log("stop")
    const gainNode = this.audioContext.createGain()
    if (type === "sound") this.audioSources[id].disconnect(this.soundGain)
    else if (type === "music") this.audioSources[id].disconnect(this.musicGain)
    this.audioSources[id].connect(gainNode)
    let parentGain
    if (type === "sound") parentGain = this.soundGain
    else if (type === "music") parentGain = this.musicGain
    gainNode.connect(parentGain)
    let volume
    if (type === "sound") volume = SETTINGS.audio.sound
    else if (type === "music") volume = SETTINGS.audio.music
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + fadeDuration / 1000
    )
    this.audioSources[id].stop(
      this.audioContext.currentTime + fadeDuration / 1000
    )
  }
}

export const AUDIO = new Aud()
