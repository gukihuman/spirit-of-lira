export async function updateCollision(
  name: string,
  map: MapInfo
): Promise<void> {
  if (States().overwriteDataAllowed) {
    const rawRes: any = await useFetch("api/updateCollision", {
      method: "POST",
      body: {
        name: name,
        accessKey: useCookie("accessKey").value,
        collision: JSON.stringify(map.collision),
      },
    })
    if (rawRes.data.value?.name) {
      console.log(timeNow() + ` ⏫ updating ${map.name} collision: updated`)
    } else {
      // value is an error
      console.log(
        timeNow() + ` ❗ update ${name} collision: ` + rawRes.data.value
      )
    }
  } else {
    console.log(
      timeNow() + ` ❗ update ${name} collision: overwrite not allowed`
    )
  }
}
