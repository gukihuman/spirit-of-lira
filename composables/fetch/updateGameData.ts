export async function updateGameData() {
  if (States().updateAllowed) {
    const res = await useFetch("api/updateGameData", {
      method: "POST",
      body: {
        name: useCookie("name").value,
        gameData: JSON.stringify(Game().data),
      },
    })
    console.log("user data is sended to a server")
  }
}
