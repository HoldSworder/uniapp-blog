class util {
  static calcTimestamp(stamp: string): string {
    let time = new Date(stamp)
    let m = (time.getMonth() + 1) < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
    let d = (time.getDate()) < 10 ? `0${time.getDate()}` : time.getDate()
    return `${time.getFullYear()}-${m}-${d}`
  }
}

export default util
