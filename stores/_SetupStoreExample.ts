// const rawStates = {
//   someState: false,
// }
// declare global {
//   type UserStates = keyof typeof rawStates
// }

// export const UserStates = defineStore("userStates", () => {
//   const state = l.mapValues(rawStates, (state) => ref(state))

//   watch(state.someState, (someState) => {
//     localStorage.setItem("someState", l.toString(dev))
//   })

//   return state
// })
