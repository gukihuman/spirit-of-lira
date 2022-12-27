import type { StatesType } from "@/stores/controlled/States"

function loadState(state: StatesType): void {
  const retrievedState = localStorage.getItem(state)
  if (retrievedState) States().dev = JSON.parse(retrievedState)
}
export function loadLocalStorage(): void {
  loadState("dev")
}
