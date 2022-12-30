export async function getCollision(map: MapInfo): Promise<void> {
  const rawRes: any = await useFetch("api/getCollision", {
    method: "POST",
    body: {
      name: map.name,
    },
  })
  if (rawRes.data.value?.name) {
    map.collision = JSON.parse(rawRes.data.value.collision)
    console.log(timeNow() + ` ⏬ getting ${map.name} collision: data received`)
  } else {
    // value is an error
    console.log(
      timeNow() + ` ✘ getting ${map.name} collision: ` + rawRes.data.value
    )
  }
}
