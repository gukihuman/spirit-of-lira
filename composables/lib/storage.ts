function loadState(state: string): void {
  const retrievedState = localStorage.getItem(state)
  if (retrievedState) States().dev = JSON.parse(retrievedState)
}

export function loadLocalStorage(): void {
  loadState("dev")
}
