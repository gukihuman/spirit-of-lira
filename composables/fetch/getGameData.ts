export async function getGameData() {
  const res = await useFetch("api/getGameData", {
    method: "POST",
    body: {
      name: useCookie("name").value,
    },
  })
  const gameData = JSON.parse(res.data.value.gameData)
  Object.assign(GameData(), gameData)
}
