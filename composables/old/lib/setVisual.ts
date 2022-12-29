// adds info to Visual from raw JSON
export function setVisual() {
  json.forEach((jsonName) => {
    // extract entity name
    const name = jsonName.meta.image.replace(/.webp/, "")

    Visual()[name] = {
      width: jsonName.frames[0].sourceSize.w,
      height: jsonName.frames[0].sourceSize.w,
      stateSet: {},
    }

    const stateSet = new Set()
    jsonName.frames.forEach((frame) => {
      // extract state name
      let state = frame.filename.replace(/[0-9]|.png/g, "")

      if (!stateSet.has(state)) {
        stateSet.add(state)
        Visual()[name].stateSet[state] = []
        Visual()[name].stateSet[state].push({
          x: frame.frame.x,
          y: frame.frame.y,
        })
      } else {
        Visual()[name].stateSet[state].push({
          x: frame.frame.x,
          y: frame.frame.y,
        })
      }
    })
  })
}
