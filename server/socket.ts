import { Server } from "socket.io"
import { defineNuxtModule } from "@nuxt/kit"
import { readFile, writeFile } from "fs/promises"
import { resolve } from "path"
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook("listen", (server) => {
      const io = new Server(server)
      nuxt.hook("close", () => io.close())
      io.on("connection", (socket) => {
        socket.on("writeFile", async (array) => {
          try {
            const filePath = resolve(__dirname, "../assets/output.json")
            await writeFile(filePath, JSON.stringify(array, null, 2))
            socket.emit("log", "Array has been written to output.json")
          } catch (err) {
            socket.emit("log", "Failed to write array to output.json")
          }
        })
      })
    })
  },
})
