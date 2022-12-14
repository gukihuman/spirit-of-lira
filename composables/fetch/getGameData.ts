export async function getGameData() {
  const res = await useFetch("api/getGameData", {
    method: "POST",
    body: {
      name: useCookie("name").value,
    },
  })
  if (res.data.value.gameData) {
    States().isDataFetched = true
    Object.assign(GameData(), JSON.parse(res.data.value.gameData))
    console.log("user data is fetched from a server")
  }
}
