class Aud {
  private audioContext
  private audioBuffers: { [key: string]: AudioBuffer } = {}
  private audioSources: { [key: string]: AudioBufferSourceNode } = {}
  private idCounter = 0
  async init() {
    this.audioContext = new AudioContext()
    for (const name in ASSETS.audios) {
      const response = await fetch(ASSETS.audios[name])
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.audioBuffers[name] = audioBuffer
    }
  }
  play(name, delay = 0) {
    const matchingBuffers = _.filter(this.audioBuffers, (buffer, key) =>
      key.includes(name)
    )
    if (_.isEmpty(matchingBuffers)) return
    const buffer = _.sample(matchingBuffers)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioContext.destination)
    const id = `${name}-${this.idCounter++}`
    this.audioSources[id] = source
    source.onended = () => delete this.audioSources[id]
    source.start(this.audioContext.currentTime + delay / 1000) // Add delay
    return id
  }
  stop(id, fadeDuration = 100) {
    if (!this.audioSources[id]) return
    const gainNode = this.audioContext.createGain()
    this.audioSources[id].disconnect(this.audioContext.destination)
    this.audioSources[id].connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    gainNode.gain.setValueAtTime(1, this.audioContext.currentTime)
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
