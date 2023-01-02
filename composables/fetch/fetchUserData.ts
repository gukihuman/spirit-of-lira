interface Res {
  name: string
  userData: string
}
export async function fetchUserData(): Promise<any> {
  const rawRes: Res | any = await useFetch("api/fetchUserData", {
    method: "POST",
    body: {
      name: useCookie("name").value,
    },
  })
  if (rawRes.data.value?.name) {
    User().data = JSON.parse(rawRes.data.value.userData)

    // 📜 remove to save progress
    setInitialUserData()

    States().overwriteDataAllowed = true
    setTicker()
    console.log(timeNow() + " ⏬ fetch user data: data received")
  } else if (rawRes.data.value === null) {
    // db not found current name => cookie overwrite is needed
    createUser()
  } else {
    // value is an error
    console.log(timeNow() + " ❗ fetch user data: " + rawRes.data.value)
  }
  return
}
