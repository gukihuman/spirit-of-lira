class Before {
  [index: string]: any

  save() {
    this.userData = _.cloneDeep(User().data)
  }
}

export const before = new Before()
