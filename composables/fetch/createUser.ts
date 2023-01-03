export async function createUser(): Promise<undefined> {
  const rawRes: any = await useFetch("api/createUser")

  if (rawRes.data.value?.name) {
    useCookie("name").value = rawRes.data.value.name
    setInitialUserData()
    States().overwriteDataAllowed = true
    setTicker()
    console.log(timeNow() + " ⏬ create a user: user is created")
  } else {
    // if no name then value is an error
    console.log(timeNow() + " ❗ create a user: " + rawRes.data.value)
  }
  return
}
