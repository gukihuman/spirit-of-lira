class Before {
  [index: string]: any

  save() {
    this.userData = l.cloneDeep(User().data)
  }
}

export const before = new Before()
