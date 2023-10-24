import { io } from "socket.io-client"
class SocketClient {
  io
  init() {
    this.io = io(window.location.host)
    this.io.on("log", (string) => console.log(string))
  }
  sendArray(array) {
    this.io.emit("writeFile", array)
  }
}
export const SOCKET = new SocketClient()
