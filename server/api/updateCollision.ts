import { writeFile } from "fs/promises"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
export default eventHandler(async (event) => {
  const body = await readBody(event) // body is our array in json string format
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)), // C:\spirit-of-lira\.nuxt\dev
    "../../assets/jumble/collision.json"
  )
  await writeFile(path, JSON.stringify(body))
  console.log("updated: assets/jumble/collision.json")
  return { statusCode: 200 }
})
