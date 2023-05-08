class Signal {
  public init() {
    gpixi.tickerAdd(() => {})
  }
}

export const gsignal = new Signal()
