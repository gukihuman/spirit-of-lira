class Scene {
  mds = {} // loaded on start
  options = {} // loaded on start
  plainText: AnyObject = {}
  steps = {}
  async init() {
    await this.mdsParse()
    this.plainTextParse()
  }
  private async mdsParse() {
    const promises = _.map(this.mds, async (value, key) => {
      const response = await fetch(value)
      const text = await response.text()
      this.plainText[key] = text
    })
    await Promise.all(promises)
  }
  private plainTextParse() {
    _.forEach(this.plainText, (value, key) => {
      this.steps[key] = []
      let lineArray
      if (value.includes("\r\n")) {
        lineArray = value.split("\r\n")
      } else {
        lineArray = value.split("\n") // for vercel environment
      }
      let images: string[] = []
      const step: AnyObject = {
        images: [],
        text: "",
        choices: [],
      }
      lineArray.forEach((line, index) => {
        // handle images
        if (line.startsWith("# ")) {
          let cleanLine = line.substring(2)
          images = cleanLine.split(", ")
          return
        }
        // choice lines doesnt immideately create a step, this is where we push step with all collected choices and previous text
        let createChoiceStep = () => {
          if (step.choices.length > 0) {
            this.steps[key].push(_.cloneDeep(step))
            step.choices = []
          }
        }
        // nandle choices
        if (line.startsWith("> ") || line.startsWith(">> ")) {
          let choiceObject: AnyObject = {}
          let cleanLine = ""
          if (line.startsWith("> ")) cleanLine = line.substring(2)
          if (line.startsWith(">> ")) {
            cleanLine = line.substring(3)
            choiceObject.arrow = true
          }
          function extractBetween(where: string, start: string, end: string) {
            choiceObject.text = cleanLine
              .substring(0, cleanLine.indexOf(start) - 2)
              .trim()
            choiceObject[where] = cleanLine.substring(
              cleanLine.indexOf(start) + 1,
              cleanLine.indexOf(end)
            )
          }
          if (cleanLine.includes("(") && !cleanLine.includes("{")) {
            extractBetween("nextSceneName", "(", ")")
          } else if (cleanLine.includes("{") && !cleanLine.includes("(")) {
            extractBetween("eventSingle", "{", "}")
          } else if (cleanLine.includes("{") && cleanLine.includes("(")) {
            extractBetween("eventSingle", "{", "}")
            extractBetween("nextSceneName", "(", ")")
          } else {
            choiceObject.text = cleanLine
          }
          step.choices.push(choiceObject)

          if (lineArray.length != index + 1) return
          else {
            createChoiceStep()
            return
          }
        }
        // here create two steps at the same time (after choices)
        createChoiceStep()
        step.text = line
        step.images = images
        this.steps[key].push(_.cloneDeep(step))
      })
    })
  }
}
export const SCENE = new Scene()
