class Remote {
  private systemMessage
  private clarification
  private data

  init() {
    //
    this.systemMessage = WORLD.hero.language.system
    this.clarification = WORLD.hero.language.clarification
    this.data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: this.systemMessage,
        },
      ],
      temperature: 1,
      stream: false,
    }

    EVENTS.onSingle("sendInput", () => REMOTE.sendInput())
  }

  // 📜 clean up remote functionality
  async sendInput() {
    this.pushNewMessages()
    this.clampData()
    console.log("⏫ " + LIB.timeNow() + " Spirit: " + REFS.input.value)
    REFS.input.value = ""
    REFS.output.value = ""
    let res = await this.queryOpenAI(this.data)
    this.data.messages.push(res.choices[0].message)
    console.log(
      "⏬ " + LIB.timeNow() + " Lira: " + res.choices[0].message.content
    )
  }

  async queryHuggingFace(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        headers: {
          Authorization: `Bearer ${useRuntimeConfig().HUGGINGFACE_TOKEN}`,
        },
        method: "POST",
        body: "",
      }
    )
    const result = await response.json()
    return result
  }

  async queryOpenAI(data, apiKey: "betterGPT" | "custom" = "betterGPT") {
    const controller = new AbortController()

    const request: AnyObject = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useRuntimeConfig().OPEN_AI_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(data),
      signal: controller.signal,
    }
    let endpoint
    if (apiKey === "betterGPT") {
      request.headers.Authorization = `Bearer BetterGPT`
      delete request.headers["Content-Type"]
      endpoint = "https://free.churchless.tech/v1/chat/completions"
    } else {
      endpoint = "https://api.openai.com/v1/chat/completions"
    }

    const response = await fetch(endpoint, request)

    if (!response.body) {
      throw new Error("ReadableStream not supported")
    }
    const reader = response.body.getReader()
    let result = ""
    let done = false
    let wrongResponse = false

    while (!done) {
      const { value, done: streamDone } = await reader.read()
      if (streamDone) {
        done = true
      } else {
        const newText = new TextDecoder().decode(value)
        if (!JSON.parse(newText).choices[0]) {
          wrongResponse = true
          break
        }
        REFS.output.value += JSON.parse(newText).choices[0].message.content
        result += newText
      }
    }
    if (wrongResponse) {
      await this.queryOpenAI(data)
    } else {
      reader.releaseLock()
      controller.abort()
      return JSON.parse(result)
    }
  }

  pushNewMessages() {
    this.data.messages.push({
      role: "user",
      content: REFS.input.value,
    })
    this.data.messages.push({
      role: "system",
      content: this.clarification,
    })
  }
  clampData() {
    if (this.data.messages.length > 10) {
      this.data.messages.splice(1, 3)
    }
  }
}

export const REMOTE = new Remote()
