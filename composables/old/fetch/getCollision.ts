import type { reqData } from "@/server/db/_getCollision"
interface req {
  method: "POST"
  body: reqData
}

export async function getCollision(name) {
  const req: req = {
    method: "POST",
    body: {
      name: name,
    },
  }
  const res = await useFetch("api/getCollision", req)

  Map().collision = JSON.parse(res.data.value.collision)
}
