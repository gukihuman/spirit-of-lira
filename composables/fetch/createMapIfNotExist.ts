interface Res {
  name: string
  collision: string
}
export async function createMapIfNotExist(
  map: MapInfo,
  accessKey: string
): Promise<void> {
  const rawRes: Res | any = await useFetch("api/createMapIfNotExist", {
    method: "POST",
    body: {
      accessKey: accessKey,
      name: map.name,
      collision: JSON.stringify(map.collision),
    },
  })
  if (rawRes.data.value.name) {
    console.log(timeNow() + `⏬ upload ${map.name} map data: map is created`)
  } else {
    // value is an error
    console.log(
      timeNow() + ` ✘ upload ${map.name} map data: ` + rawRes.data.value
    )
  }
}
