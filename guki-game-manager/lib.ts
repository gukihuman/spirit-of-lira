//
// returns string with time in the format 22:43:54
export function _timeNow(): string {
  function _pad(num: number): string {
    return String(num).padStart(2, "0")
  }
  const now = new Date()
  const current: string =
    _pad(now.getHours()) +
    ":" +
    _pad(now.getMinutes()) +
    ":" +
    _pad(now.getSeconds())
  return current
}
