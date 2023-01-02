export async function pushCollision(name: string, map: any): Promise<void> {
  if (States().overwriteDataAllowed) {
    const rawRes: any = await useFetch("api/pushCollision", {
      method: "POST",
      body: {
        name: name,
        accessKey: useCookie("accessKey").value,
        collision: JSON.stringify(map.collision),
      },
    })
    if (rawRes.data.value?.name) {
      console.log(timeNow() + ` ⏫ push ${map.name} collision: updated`)
    } else {
      // value is an error
      console.log(
        timeNow() + ` ❗ push ${name} collision: ` + rawRes.data.value
      )
    }
  } else {
    // only after initial fetch
    console.log(timeNow() + ` ❗ push ${name} collision: overwrite not allowed`)
  }
}
