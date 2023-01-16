export async function startup() {
  //
  // devAccess
  useCookie("accessKey").value = useCookie("accessKey").value || "empty"
  if (useCookie("name").value == "guki") States().devAccess = true

  input.initialize()

  let handleUser = Remote.fetchUserData()
  if (!useCookie("name").value) handleUser = Remote.createUser()

  await Promise.all([Remote.fetchCollision(), pixi.initialize(), handleUser])

  States().allLoaded = true
}
