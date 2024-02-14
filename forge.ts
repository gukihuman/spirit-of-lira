const { execSync } = require("child_process")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const texture_packer_path = "C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin"
process.env.PATH = `${process.env.PATH};${texture_packer_path}`
// 📜 add caching

const padding = 44
const secondPadding = 24

function pngOrWebp(path) {
    return /\.(png|webp)$/.test(path)
}
const entitiesInput = path.resolve("whales/entities/forge")
const entitiesOutput = path.resolve("assets/entities")
fs.readdir(entitiesInput, (err, files) => {
    files.forEach((file) => {
        if (pngOrWebp(file)) {
            const file_name = path.parse(file).name
            sharp(path.join(entitiesInput, file))
                .webp()
                .toFile(
                    path.join(entitiesOutput, `${file_name}.webp`),
                    (err, info) => {
                        if (err) {
                            console.error(err)
                        } else {
                            const before = `entities: ${file}`.padEnd(padding)
                            console.log(`${before} ->     ${file_name}.webp`)
                        }
                    }
                )
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
const mapInput = path.resolve("whales/map/green-forest.jpg")
const mapOutput = path.resolve("assets/map")
const tile_size = 1000
const tiles_per_side = 5
sharp(mapInput)
    .metadata()
    .then(() => {
        for (let x = 0; x < tiles_per_side; x++) {
            for (let y = 0; y < tiles_per_side; y++) {
                const file_name = `0${y + 5}0${x + 5}.webp`
                const forgedMap = path.join(mapOutput, file_name)
                sharp(mapInput)
                    .extract({
                        left: x * tile_size,
                        top: y * tile_size,
                        width: tile_size,
                        height: tile_size,
                    })
                    .webp()
                    .toFile(forgedMap)
                    .then(() => {
                        const before = `map: green-forest`.padEnd(padding)
                        console.log(`${before} ->     ${file_name}`)
                    })
                    .catch((err) => console.error(err))
            }
        }
    })
const scene_input_path = path.resolve("whales/scenes/forge")
const scene_output_path = path.resolve("assets/scenes/webps")
fs.readdir(scene_input_path, (err, files) => {
    files.forEach((file) => {
        const file_name = path.parse(file).name
        sharp(path.join(scene_input_path, file))
            .webp()
            .toFile(
                path.join(scene_output_path, `${file_name}.webp`),
                (err, info) => {
                    if (err) {
                        console.error(err)
                    } else {
                        const before = `interface: ${file}`.padEnd(padding)
                        console.log(`${before} ->     ${file_name}.webp`)
                    }
                }
            )
    })
})
const interface_input_path = path.resolve("whales/interface/forge")
const interface_output_path = path.resolve("assets/interface")
fs.readdir(interface_input_path, (err, files) => {
    files.forEach((file) => {
        const file_name = path.parse(file).name
        sharp(path.join(interface_input_path, file))
            .webp()
            .toFile(
                path.join(interface_output_path, `${file_name}.webp`),
                (err, info) => {
                    if (err) {
                        console.error(err)
                    } else {
                        const before = `interface: ${file}`.padEnd(padding)
                        console.log(`${before} ->     ${file_name}.webp`)
                    }
                }
            )
    })
})
