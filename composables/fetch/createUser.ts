export async function createUser() {
  const res = await useFetch("/api/createUser")
  States().updateAllowed = true
  const name = useCookie("name")
  name.value = res.data.value.name
}
