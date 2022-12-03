import hero from "@/assets/anim/hero.json";
const animBreedsJSON = [hero];

// adds info to AnimStore from raw JSON
export function animSetup() {
  animBreedsJSON.forEach((breedJSON) => {
    const breedName = breedJSON.meta.image.replace(/.webp/, "");
    useAnimStore()[breedName] = {
      width: breedJSON.frames[0].sourceSize.w,
      height: breedJSON.frames[0].sourceSize.w,
      animSet: {},
    };
    const animSet = new Set();
    breedJSON.frames.forEach((frame) => {
      let animation: string = frame.filename.replace(/[0-9]|.png/g, "");
      if (!animSet.has(animation)) {
        animSet.add(animation);
        useAnimStore()[breedName].animSet[animation] = [];
        useAnimStore()[breedName].animSet[animation].push([
          frame.frame.x,
          frame.frame.y,
        ]);
      } else {
        useAnimStore()[breedName].animSet[animation].push([
          frame.frame.x,
          frame.frame.y,
        ]);
      }
    });
  });
}
