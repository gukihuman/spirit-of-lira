export class Remote {
  // 📜 its just an example of some lines, not working =)
  static async oldStartup() {
    let handleUser = Remote.fetchUserData()
    if (!useCookie("name").value) handleUser = Remote.createUser()

    await Promise.all([Remote.fetchCollision(), pixi.init(), handleUser])
  }

  static async createUser() {
    const rawRes: any = await useFetch("api/createUser")

    if (rawRes.data.value?.name) {
      useCookie("name").value = rawRes.data.value.name
      States().overwriteDataAllowed = true
      console.log(timeNow() + " ⏬ create a user: user is created")
    } else {
      // if no name then value is an error
      console.log(timeNow() + " ❗ create a user: " + rawRes.data.value)
    }
  }
  static async fetchUserData() {
    const rawRes: any = await useFetch("api/fetchUserData", {
      method: "POST",
      body: { name: useCookie("name").value },
    })
    if (rawRes.data.value?.name) {
      //
      // 📜 turn on later
      // User().data = JSON.parse(rawRes.data.value.userData)

      States().overwriteDataAllowed = true
      console.log(timeNow() + " ⏬ fetch user data: data received")
    } else if (rawRes.data.value === null) {
      // db not found current name
      this.createUser()
      console.log(timeNow() + " ⏬ fetch user data: new user is created")
    } else {
      // value is an error
      console.log(timeNow() + " ❗ fetch user data: " + rawRes.data.value)
    }
  }
  static async pushUserData() {
    if (States().overwriteDataAllowed) {
      const rawRes: any = await useFetch("api/pushUserData", {
        method: "POST",
        body: {
          name: useCookie("name").value,
          userData: JSON.stringify(User().data),
        },
      })
      if (rawRes.data.value?.name) {
        console.log(timeNow() + ` ⏫ push user data: updated`)
      } else {
        // value is an error
        console.log(timeNow() + ` ❗ push user data: ` + rawRes.data.value)
      }
    } else {
      // only after initial fetch
      console.log(timeNow() + ` ❗ push user data: overwrite not allowed`)
    }
  }
  static async fetchCollision() {
    const res: any = await useFetch("api/fetchCollision", {
      method: "POST",
      body: { name: "collision" },
    })
    if (res.data.value?.name) {
      info.collision = JSON.parse(res.data.value.collisionData)
      console.log(timeNow() + " ⏬ fetch collision: data received")
    } else {
      // value is an error
      console.log(timeNow() + " ❗ fetch collision: " + res.data.value)
    }
  }
  static async pushCollision() {
    if (States().overwriteDataAllowed) {
      const res: any = await useFetch("api/pushCollision", {
        method: "POST",
        body: {
          name: "collision",
          accessKey: useCookie("accessKey").value,
          collisionData: JSON.stringify(info.collision),
        },
      })
      if (res.data.value?.name) {
        console.log(timeNow() + " ⏫ push collision: updated")
      } else {
        // value is an error
        console.log(timeNow() + " ❗ push collision: " + res.data.value)
      }
    } else {
      // only after initial fetch
      console.log(timeNow() + ` ❗ push collision: overwrite not allowed`)
    }
  }
}
