class Remote {
  private systemMessage = new Hero().language.system
  private clarification = new Hero().language.clarification

  // huggingface
  // private async queryOpenAssistant(data) {
  //   const response = await fetch(
  //     "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${useRuntimeConfig().HUGGINGFACE_TOKEN}`,
  //       },
  //       method: "POST",
  //       body: "",
  //     }
  //   )
  //   const result = await response.json()
  //   return result
  // }

  private async queryOpenAI(data, cost: "free" | "api" = "free") {
    const controller = new AbortController()

    const request: { [index: string]: any } = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${useRuntimeConfig().OPEN_AI_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(data),
      signal: controller.signal,
    }
    let endpoint = ""
    if (cost === "free") {
      delete request.headers
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
        SYSTEM_DATA.refs.output +=
          JSON.parse(newText).choices[0].message.content
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

  private data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: this.systemMessage,
      },
    ],
    temperature: 1.3,
    stream: false,
  }
  private pushNewMessages() {
    this.data.messages.push({
      role: "user",
      content: SYSTEM_DATA.refs.input.value,
    })
    this.data.messages.push({
      role: "system",
      content: this.clarification,
    })
  }
  private clampData() {
    if (this.data.messages.length > 10) {
      this.data.messages.splice(1, 3)
    }
  }

  init() {
    PIXI_GUKI.tickerAdd(async () => {
      // if (gim.signals.sendInput) {
      //   if (!SYSTEM_DATA.refs.input) return
      //   this.pushNewMessages()
      //   this.clampData()
      //   console.log("⏫ " + LIB.timeNow() + " Spirit: " + SYSTEM_DATA.refs.input.value)
      //   SYSTEM_DATA.refs.input.value = ""
      //   USER_DATA.states.output = ""
      //   let res = await this.queryOpenAI(this.data)
      //   this.data.messages.push(res.choices[0].message)
      //   console.log(
      //     "⏬ " + LIB.timeNow() + " Lira: " + res.choices[0].message.content
      //   )
      // const moodReq = _.cloneDeep(this.data)
      // moodReq.messages.push({
      //   role: "system",
      //   content:
      //     "analyze previous conversation and make a decision how happy Lira is now, use numbers from 0 to 100 where 100 is the most positive and 0 is the most negative. respond only with that number",
      // })
      // let moodRes = await this.queryOpenAI(moodReq)
      // console.log(moodRes.choices[0].message.content)
      // }
    }, "REMOTE")
  }
}
export const REMOTE = new Remote()
