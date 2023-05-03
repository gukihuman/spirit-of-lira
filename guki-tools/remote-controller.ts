import json from "@/language/system-message.json"

class RemoteController {
  private systemMessage = json["system-message"]

  // huggnface
  // private async queryOpenAssistant(data) {
  //   const response = await fetch(
  //     "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
  //     {
  //       headers: {
  //         Authorization: "Bearer {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}",
  //       },
  //       method: "POST",
  //       body: "",
  //     }
  //   )
  //   const result = await response.json()
  //   return result
  // }

  private async queryOpenAIwithKey(data) {
    const controller = new AbortController()
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      method: "POST",
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    if (!response.body) {
      throw new Error("ReadableStream not supported")
    }

    const reader = response.body.getReader()
    let result = ""
    let done = false

    while (!done) {
      const { value, done: streamDone } = await reader.read()
      if (streamDone) {
        done = true
      } else {
        const newText = new TextDecoder().decode(value)
        gud.states.output += JSON.parse(newText).choices[0].message.content
        result += newText
      }
    }

    reader.releaseLock()
    controller.abort()

    return JSON.parse(result)
  }

  // ...

  private async queryOpenAIforFree(data) {
    const response = await fetch(
      "https://free.churchless.tech/v1/chat/completions",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
    const result = await response.json()
    return result
  }
  private _data = {
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
  get data() {
    this._data.messages.push({
      role: "user",
      content: gud.states.input,
    })
    this._data.messages.push({
      role: "system",
      content: "answer shortly, do not offer assistance!",
    })
    if (this._data.messages.length > 10) {
      this._data.messages.splice(1, 3)
    }

    return this._data
  }

  public initialize() {
    gpm.app?.ticker.add(async () => {
      if (gim.signals.sendInput) {
        if (!gsd.refs.input) return

        gsd.refs.input.value = ""
        gud.states.output = ""
        let res = await this.queryOpenAIwithKey(this.data)

        this._data.messages.push(res.choices[0].message)
        console.log(
          "⏬ " + glib.timeNow() + ": " + res.choices[0].message.content
        )
      }
    })
  }
}
export const grc = new RemoteController()
