export function storeRef(name, ref) {
  useRefStore()[name] = ref;
}
