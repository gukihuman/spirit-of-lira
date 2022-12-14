export async function createUser() {
  const res = await useFetch("/api/createUser")
  States().isDataFetched = true
  const name = useCookie("name")
  name.value = res.data.value.name
}
