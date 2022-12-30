interface Res {
  name: string
  userData: string
}
export async function getUserData(): Promise<void> {
  const rawRes: Res | any = await useFetch("api/getUserData", {
    method: "POST",
    body: {
      name: useCookie("name").value,
    },
  })
  if (rawRes.data.value?.name) {
    User().data = JSON.parse(rawRes.data.value.userData)
    States().overwriteDataAllowed = true
    console.log(timeNow() + " ⏬ getting user data: data received")
  } else if (rawRes.data.value === null) {
    // db not found current name => cookie overwrite is needed
    createUser()
  } else {
    // value is an error
    console.log(timeNow() + " ✘ getting user data: " + rawRes.data.value)
  }
}
