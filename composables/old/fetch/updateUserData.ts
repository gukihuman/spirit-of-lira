export async function updateUserData() {
  if (States().updateAllowed) {
    const res = await useFetch("api/updateUserData", {
      method: "POST",
      body: {
        name: useCookie("name").value,
        userData: JSON.stringify(Game().data),
      },
    })
    console.log("user data is sended to a server")
  }
}
