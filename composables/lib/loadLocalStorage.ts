import type { States } from "~~/stores/States"

function loadState(state: States): void {
  const retrievedState = localStorage.getItem(state)
  if (retrievedState) st().dev = JSON.parse(retrievedState)
}
export function loadLocalStorage(): void {
  loadState("dev")
}
