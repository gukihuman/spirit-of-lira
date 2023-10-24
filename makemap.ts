const sharp = require("sharp")
const fs = require("fs")

const inputImage = "C:\\spirit-of-lira\\whales\\map\\green-forest.jpg"
const outputDir = "./assets/chunks/"
const tileSize = 1000
const tilesPerSide = 5

sharp(inputImage)
  .metadata()
  .then(() => {
    for (let x = 0; x < tilesPerSide; x++) {
      for (let y = 0; y < tilesPerSide; y++) {
        const outputImage = `${outputDir}0${y + 5}0${x + 5}.webp`

        sharp(inputImage)
          .extract({
            left: x * tileSize,
            top: y * tileSize,
            width: tileSize,
            height: tileSize,
          })
          .webp()
          .toFile(outputImage)
          .then(() => console.log(`Tile ${outputImage} created.`))
          .catch((err) => console.error(err))
      }
    }
  })
  .catch((err) => console.error(err))
