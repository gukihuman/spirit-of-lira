export async function updateGameData() {
  if (States().isDataFetched) {
    const cleanGameData = JSON.parse(JSON.stringify(GameData()))
    delete cleanGameData.$id
    delete cleanGameData._isOptionsAPI
    const res = await useFetch("api/updateGameData", {
      method: "POST",
      body: {
        name: useCookie("name").value,
        gameData: JSON.stringify(cleanGameData),
      },
    })
    console.log("user data is sended to a server")
  }
}
