interface Res {
  name: string
  collision: string
}
export async function createMapIfNotExist(
  name: string,
  info: any,
  accessKey: string
): Promise<void> {
  const rawRes: Res | any = await useFetch("api/createMapIfNotExist", {
    method: "POST",
    body: {
      accessKey: accessKey,
      name: name,
      collision: JSON.stringify(info.collision),
    },
  })
  if (rawRes.data.value.name) {
    console.log(timeNow() + ` ⏫ upload ${name} map data: map is created`)
  } else {
    // value is an error
    console.log(timeNow() + ` ❗ upload ${name} map data: ` + rawRes.data.value)
  }
}
