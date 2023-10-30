const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

// 📜 make it possible for more maps
const mapToForgeRelative = "whales/map/green-forest.jpg"
const mapOutputRelative = "assets/map"
const mapToForge = path.resolve(mapToForgeRelative)
const mapOutput = path.resolve(mapOutputRelative)
const tileSize = 1000
const tilesPerSide = 5
sharp(mapToForge)
  .metadata()
  .then(() => {
    for (let x = 0; x < tilesPerSide; x++) {
      for (let y = 0; y < tilesPerSide; y++) {
        const mapName = `0${y + 5}0${x + 5}.webp`
        const forgedMap = path.join(mapOutput, mapName)
        sharp(mapToForge)
          .extract({
            left: x * tileSize,
            top: y * tileSize,
            width: tileSize,
            height: tileSize,
          })
          .webp()
          .toFile(forgedMap)
          .then(() =>
            console.log(
              `${mapToForgeRelative} -> ${mapOutputRelative}/${mapName}`
            )
          )
          .catch((err) => console.error(err))
      }
    }
  })
const interfaceInputRelative = "whales/interface/forge"
const interfaceOutputRelative = "assets/interface"
const interfaceInput = path.resolve(interfaceInputRelative)
const interfaceOutput = path.resolve(interfaceOutputRelative)
fs.readdir(interfaceInput, (err, files) => {
  files.forEach((file) => {
    if (file.endsWith(".png") || file.endsWith(".jpg")) {
      const fileName = path.parse(file).name
      sharp(path.join(interfaceInput, file))
        .webp()
        .toFile(path.join(interfaceOutput, `${fileName}.webp`), (err, info) => {
          if (err) {
            console.error(err)
          } else {
            console.log(
              `${interfaceInputRelative}/${file} -> ${interfaceOutputRelative}/${fileName}.webp`
            )
          }
        })
    }
  })
})
