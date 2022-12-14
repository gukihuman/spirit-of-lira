import { breeds } from "@/composables/imports/json"

// adds info to AnimStore from raw JSON
export function animSetup() {
  breeds.forEach((json) => {
    // get name from json
    const name = json.meta.image.replace(/.webp/, "")

    // create object in store with that name
    Animation().breeds[name] = {
      width: json.frames[0].sourceSize.w,
      height: json.frames[0].sourceSize.w,
      animSet: {},
    }

    const breed = Animation().breeds[name]

    // fill animSet
    const animSet = new Set()
    json.frames.forEach((frame) => {
      // get animation name
      let animation = frame.filename.replace(/[0-9]|.png/g, "")

      if (!animSet.has(animation)) {
        animSet.add(animation)
        breed.animSet[animation] = []
        breed.animSet[animation].push({ x: frame.frame.x, y: frame.frame.y })
      } else {
        breed.animSet[animation].push({ x: frame.frame.x, y: frame.frame.y })
      }
    })
  })
}
