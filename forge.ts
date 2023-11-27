const { execSync } = require("child_process")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const TexturePacker = "C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin"
process.env.PATH = `${process.env.PATH};${TexturePacker}`
// 📜 add caching

const padding = 44
const secondPadding = 24

const entitiesInputRelative = "whales/entities/forge"
const entitiesOutputRelative = "assets/entities"
const entitiesInput = path.resolve(entitiesInputRelative)
const entitiesOutput = path.resolve(entitiesOutputRelative)
fs.readdir(entitiesInputRelative, (err, files) => {
  files.forEach((file) => {
    if (pngOrWebp(file)) {
      const justName = path.parse(file).name
      sharp(path.join(entitiesInput, file))
        .webp()
        .toFile(path.join(entitiesOutput, `${justName}.webp`), (err, info) => {
          if (err) {
            console.error(err)
          } else {
            const before = `entities: ${file}`.padEnd(padding)
            console.log(`${before} ->     ${justName}.webp`)
          }
        })
    } else {
      // file is folder e.g. "lira"
      const outputWebp = path.join(entitiesOutput, file + ".webp")
      const outputJson = path.join(entitiesOutput, file + ".json")
      const command = `TexturePacker --format pixijs --sheet ${outputWebp} --data ${outputJson} ${path.join(
        entitiesInput,
        file
      )}`
      try {
        execSync(command)
        const before = `entities: ${file}`.padEnd(padding)
        const webp = `${file}.webp`.padEnd(secondPadding)
        console.log(`${before} ->     ${webp} ${file}.json`)
      } catch (error) {
        console.error(`Failed to create spritesheet for ${file}`, error)
      }
    }
  })
})
// 📜 make it possible for more maps
const mapInputRelative = "whales/map/green-forest.jpg"
const mapOutputRelative = "assets/map"
const mapInput = path.resolve(mapInputRelative)
const mapOutput = path.resolve(mapOutputRelative)
const tileSize = 1000
const tilesPerSide = 5
sharp(mapInput)
  .metadata()
  .then(() => {
    for (let x = 0; x < tilesPerSide; x++) {
      for (let y = 0; y < tilesPerSide; y++) {
        const mapName = `0${y + 5}0${x + 5}.webp`
        const forgedMap = path.join(mapOutput, mapName)
        sharp(mapInput)
          .extract({
            left: x * tileSize,
            top: y * tileSize,
            width: tileSize,
            height: tileSize,
          })
          .webp()
          .toFile(forgedMap)
          .then(() => {
            const before = `map: green-forest`.padEnd(padding)
            console.log(`${before} ->     ${mapName}`)
          })
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
    const justName = path.parse(file).name
    sharp(path.join(interfaceInput, file))
      .webp()
      .toFile(path.join(interfaceOutput, `${justName}.webp`), (err, info) => {
        if (err) {
          console.error(err)
        } else {
          const before = `interface: ${file}`.padEnd(padding)
          console.log(`${before} ->     ${justName}.webp`)
        }
      })
  })
})
function pngOrWebp(path) {
  return /\.(png|webp)$/.test(path)
}
