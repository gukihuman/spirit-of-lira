export async function createUser() {
  const res = await useFetch("/api/createUser")

  const name = useCookie("name")
  name.value = res.data.value.name
}
