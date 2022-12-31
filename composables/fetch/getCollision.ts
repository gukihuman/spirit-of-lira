export async function getCollision(name: string, map: MapInfo): Promise<void> {
  const rawRes: any = await useFetch("api/getCollision", {
    method: "POST",
    body: {
      name: name,
    },
  })
  if (rawRes.data.value?.name) {
    map.collision = JSON.parse(rawRes.data.value.collision)
    console.log(timeNow() + ` ⏬ get ${name} collision: data received`)
  } else {
    // value is an error
    console.log(timeNow() + ` ❗ get ${name} collision: ` + rawRes.data.value)
  }
}
