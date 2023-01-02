export async function pushUserData(): Promise<void> {
  if (States().overwriteDataAllowed) {
    const rawRes: any = await useFetch("api/pushUserData", {
      method: "POST",
      body: {
        name: useCookie("name").value,
        userData: JSON.stringify(User().data),
      },
    })
    if (rawRes.data.value?.name) {
      console.log(timeNow() + ` ⏫ push user data: updated`)
    } else {
      // value is an error
      console.log(timeNow() + ` ❗ push user data: ` + rawRes.data.value)
    }
  } else {
    // only after initial fetch
    console.log(timeNow() + ` ❗ push user data: overwrite not allowed`)
  }
}
