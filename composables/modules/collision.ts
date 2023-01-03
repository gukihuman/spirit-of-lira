interface dataTransfer {
  // Y-axis, X-axis
  QI: Array<Array<number>>
  QII: Array<Array<number>>
  QIII: Array<Array<number>>
  QIV: Array<Array<number>>
}
interface targetLength {
  // Y-axis, X-axis
  QI: [number, number]
  QII: [number, number]
  QIII: [number, number]
  QIV: [number, number]
}
class Collision {
  // quadrants
  QI: Array<Array<number>> // X-axis is positive, Y-axis is positive
  QII: Array<Array<number>> // X-axis is negative, Y-axis is positive
  QIII: Array<Array<number>> // X-axis is negative, Y-axis is negative
  QIV: Array<Array<number>> // X-axis is povitive, Y-axis is negative
  targetLengthQI: [number, number]
  targetLengthQII: [number, number]
  targetLengthQIII: [number, number]
  targetLengthQIV: [number, number]

  constructor() {
    this.QI = []
    this.QII = []
    this.QIII = []
    this.QIV = []
    this.targetLengthQI = [0, 0]
    this.targetLengthQII = [0, 0]
    this.targetLengthQIII = [0, 0]
    this.targetLengthQIV = [0, 0]
  }
  private extendLengthIfNeeded(
    q: Array<Array<number>>,
    targetLength: [number, number],
    qName: string
  ) {
    let changed = false
    // X-axis
    if (q[0].length < targetLength[1]) {
      const diff = targetLength[1] - q[0].length
      q.forEach((x) => {
        for (let i of l.range(diff)) x.push(0)
      })
      changed = true
    }
    // Y-axis
    if (q.length < targetLength[0]) {
      const diff = targetLength[0] - q.length
      let x = []
      for (let i of l.range(q[0].length)) x.push(0)
      for (let i of l.range(diff)) q.push(x)
      changed = true
    }
    if (changed)
      console.log(
        timeNow() + ` ✅ collision length of ${qName} is extended: ` + q
      )
  }
  setTargetLength(length: targetLength): void {
    this.targetLengthQI = length.QI
    this.targetLengthQII = length.QII
    this.targetLengthQIII = length.QIII
    this.targetLengthQIV = length.QIV
  }
  async fetch(): Promise<undefined> {
    const res: any = await useFetch("api/fetchCollision", {
      method: "POST",
      body: {
        name: "collision",
      },
    })
    if (res.data.value?.name) {
      const dataTransfer: dataTransfer = JSON.parse(
        res.data.value.collisionData
      )
      this.QI = dataTransfer.QI
      this.QII = dataTransfer.QII
      this.QIII = dataTransfer.QIII
      this.QIV = dataTransfer.QIV
      console.log(timeNow() + " ⏬ fetch collision: data received")
    } else {
      // value is an error
      console.log(timeNow() + " ❗ fetch collision: " + res.data.value)
    }
    this.extendLengthIfNeeded(this.QI, this.targetLengthQI, "QI")
    this.extendLengthIfNeeded(this.QII, this.targetLengthQII, "QII")
    this.extendLengthIfNeeded(this.QIII, this.targetLengthQIII, "QIII")
    this.extendLengthIfNeeded(this.QIV, this.targetLengthQIV, "QIV")
    return
  }
  async push(): Promise<undefined> {
    if (States().overwriteDataAllowed) {
      const dataTransfer: dataTransfer = {
        QI: this.QI,
        QII: this.QII,
        QIII: this.QIII,
        QIV: this.QIV,
      }
      const res: any = await useFetch("api/pushCollision", {
        method: "POST",
        body: {
          name: "collision",
          accessKey: useCookie("accessKey").value,
          collisionData: JSON.stringify(dataTransfer),
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
      console.log(
        timeNow() + ` ❗ push ${name} collision: overwrite not allowed`
      )
    }
    return
  }
}
export const collision = new Collision()
