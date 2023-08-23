class Scene {
  mdPaths = {}
  plainText: AnyObject = {}
  optionsByImage: AnyObject = {}
  steps = {}
  async init() {
    await this.mdPathsParse()
    this.plainTextParse()
  }
  private async mdPathsParse() {
    const promises = _.map(this.mdPaths, async (value, key) => {
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
      console.log(value)
      if (value.includes("\r\n")) {
        lineArray = value.split("\r\n")
      } else {
        lineArray = value.split("\n") // for vercel
      }
      console.log(lineArray)
      let images: string[] = []
      const step: AnyObject = {
        images: [],
        text: "",
        choices: [],
      }
      lineArray.forEach((line) => {
        // handle images
        if (line.startsWith("# ")) {
          let cleanLine = line.substring(2)
          images = cleanLine.split(", ")
          return
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
          if (cleanLine.includes("(")) {
            choiceObject.text = cleanLine
              .substring(0, cleanLine.indexOf("(") - 2)
              .trim()
            choiceObject.nextSceneName = cleanLine.substring(
              cleanLine.indexOf("(") + 1,
              cleanLine.indexOf(")")
            )
          } else {
            choiceObject.text = cleanLine
          }
          step.choices.push(choiceObject)
          return
        }
        // choice lines doesnt immideately create a step, this is where we push step with all collected choices and previous text
        if (step.choices.length > 0) {
          this.steps[key].push(_.cloneDeep(step))
          step.choices = []
        }
        // and in the same iteration a new "after-choice" line as plain text
        step.text = line
        step.images = images
        this.steps[key].push(_.cloneDeep(step))
      })
    })
  }
}
export let SCENE = new Scene()
