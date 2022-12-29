export async function getUserData() {
  const res: = await useFetch("api/getUserData", {
    method: "POST",
    body: {
      name: useCookie("name").value,
    },
  })
  if (res.data.value.userData) {
    States().updateAllowed = true
    Game().data = JSON.parse(res.data.value.userData)
    console.log("user data is fetched from a server")
  }
}
