export async function startup() {
  //
  // devAccess
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"
  if (useCookie("name").value == "guki") States().devAccess = true

  // connect User
  if (useCookie("name").value) await Remote.fetchUserData()
  else await Remote.createUser()

  input.initialize()
  await pixi.initialize()

  States().allLoaded = true
}
