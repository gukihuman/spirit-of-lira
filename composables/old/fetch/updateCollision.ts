export async function updateCollision(name, collision) {
  const res = await useFetch("api/updateCollision", {
    method: "POST",
    body: {
      name: name,
      accessKey: useCookie("accessKey").value,
      collision: JSON.stringify(collision),
    },
  })
  console.log("collision data is sended to a server")
}
