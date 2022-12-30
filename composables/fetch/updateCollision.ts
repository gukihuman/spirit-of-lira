export async function updateCollision(map: MapInfo): Promise<void> {
  if (States().overwriteDataAllowed) {
    const rawRes: any = await useFetch("api/updateCollision", {
      method: "POST",
      body: {
        name: map.name,
        accessKey: useCookie("accessKey").value,
        collision: JSON.stringify(map.collision),
      },
    })
    if (rawRes.data.value?.name) {
      console.log(timeNow() + ` ⏫ updating ${map.name} collision: updated`)
    } else {
      // value is an error
      console.log(
        timeNow() + ` ✘ updating ${map.name} collision: ` + rawRes.data.value
      )
    }
  } else {
    console.log(
      timeNow() + ` ✘ updating ${map.name} collision: overwrite not allowed`
    )
  }
}
