export function checkBobcat() {
  useCookie("name").value == "lime_full_bobcat" ? (States().bobcat = true) : {}
  const accessKey = useCookie("accessKey")
  accessKey.value = accessKey.value || "empty"
}
