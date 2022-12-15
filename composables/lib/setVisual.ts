import { json } from "@/composables/imports/json"

// adds info to Visual from raw JSON
export function setVisual() {
  json.forEach((jsonName) => {
    // extract name fram meta info
    const name = jsonName.meta.image.replace(/.webp/, "")

    Visual()[name] = {
      width: jsonName.frames[0].sourceSize.w,
      height: jsonName.frames[0].sourceSize.w,
      animSet: {},
    }

    const animSet = new Set()
    jsonName.frames.forEach((frame) => {
      // extract animation name
      let animation = frame.filename.replace(/[0-9]|.png/g, "")

      if (!animSet.has(animation)) {
        animSet.add(animation)
        Visual()[name].animSet[animation] = []
        Visual()[name].animSet[animation].push({
          x: frame.frame.x,
          y: frame.frame.y,
        })
      } else {
        Visual()[name].animSet[animation].push({
          x: frame.frame.x,
          y: frame.frame.y,
        })
      }
    })
  })
}
