export async function fetchCollision(name: string, map: any): Promise<void> {
  const rawRes: any = await useFetch("api/fetchCollision", {
    method: "POST",
    body: {
      name: name,
    },
  })
  if (rawRes.data.value?.name) {
    map.collision = JSON.parse(rawRes.data.value.collision)
    console.log(timeNow() + ` ⏬ fetch ${name} collision: data received`)
  } else {
    // value is an error
    console.log(timeNow() + ` ❗ fetch ${name} collision: ` + rawRes.data.value)
  }
}
