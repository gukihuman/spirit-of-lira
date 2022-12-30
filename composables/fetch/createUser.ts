export async function createUser(): Promise<void> {
  const rawRes: any = await useFetch("api/createUser")

  if (rawRes.data.value?.name) {
    useCookie("name").value = rawRes.data.value.name
    User().data = JSON.parse(rawRes.data.value.userData)
    States().overwriteDataAllowed = true
    console.log(timeNow() + "⏬ creating a user: user is created")
  } else {
    // if no name then value is an error
    console.log(timeNow() + " ✘ creating a user: " + rawRes.data.value)
  }
}
