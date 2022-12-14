export async function getCollision(name) {
  const res = await useFetch("api/getCollision", {
    method: "POST",
    body: {
      name: name,
    },
  })
  Map().collision = JSON.parse(res.data.value.collision)
}
