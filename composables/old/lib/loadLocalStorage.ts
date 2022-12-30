function loadState(state: States): void {
  const retrievedState = localStorage.getItem(state)
  if (retrievedState) UiStates().dev = JSON.parse(retrievedState)
}
export function loadLocalStorage(): void {
  loadState("dev")
}
