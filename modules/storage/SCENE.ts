class Scene {
  options = {
    "n1-lira-no-light": { hue: -30 },
    "n1-lira-arms-down": { hue: -30 },
    "n1-lira-arms-raised": { hue: -30 },
    "n1-nighty": { x: 370, y: 700 },
    "n1-nighty-close": { x: 950 },
    "a0-solid-dark": { x: 610, y: 750, brightness: 1.1 },
  }
  conditions = {
    n1: {
      text: () => `Kill bunbos ${PROGRESS.mobs.bunbo} / 30`,
      condition: () => PROGRESS.mobs.bunbo >= 30,
    },
  }
  plainText: AnyObject = {}
  steps = {}
  async init() {
    await this.importMds()
    this.plainTextParse()
  }
  private async importMds() {
    const promises = _.map(ASSETS.mds, async (value, key) => {
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
        if (line.startsWith(">")) {
          let choiceObject: AnyObject = {}
          let cleanLine = ""
          if (line.startsWith("> ")) {
            cleanLine = line.substring(2)
          }
          if (line.startsWith(">> ")) {
            choiceObject.arrow = true
            cleanLine = line.substring(3)
          }
          if (line.startsWith(">[")) {
            choiceObject.bulb = true
            choiceObject.bulbScene = line.substring(2, line.indexOf("]"))
            cleanLine = line.substring(line.indexOf("]") + 1).trim()
          }
          function extractBetween(start: string, end: string, where: string) {
            choiceObject.text = cleanLine
              .substring(0, cleanLine.indexOf(start) - 1)
              .trim()
            choiceObject[where] = cleanLine.substring(
              cleanLine.indexOf(start) + 1,
              cleanLine.indexOf(end)
            )
          }
          if (cleanLine.includes("(") && !cleanLine.includes("{")) {
            extractBetween("(", ")", "nextSceneName")
          } else if (cleanLine.includes("{") && !cleanLine.includes("(")) {
            extractBetween("{", "}", "choiceEvents")
          } else if (cleanLine.includes("{") && cleanLine.includes("(")) {
            extractBetween("{", "}", "choiceEvents")
            extractBetween("(", ")", "nextSceneName")
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
