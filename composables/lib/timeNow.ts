function pad(num: number): string {
  return String(num).padStart(2, "0")
}

export function timeNow(): string {
  const now = new Date()
  const current: string =
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes()) +
    ":" +
    pad(now.getSeconds())
  return current
}
