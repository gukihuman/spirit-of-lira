export async function startup() {
  //
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"
  if (useCookie("name").value == "guki") States().devAccess = true

  if (useCookie("name").value) await Remote.fetchUserData()
  else await Remote.createUser()

  await pixi.initialize()

  States().allLoaded = true
}
