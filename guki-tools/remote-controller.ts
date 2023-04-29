class RemoteController {
  static async query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        headers: {
          Authorization: "Bearer {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}",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    )
    const result = await response.json()
    return result
  }
}
export const grc = new RemoteController()
