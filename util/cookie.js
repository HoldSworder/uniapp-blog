export default {
  set(obj, time) {
    const date = new Date()
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const item = obj[key]
        document.cookie = `${key}=${item};expires=${date.setTime(date.getTime() + (time * 24 * 3600 * 1000))}`
      }
    }
  },
  getAll() {
    const data = document.cookie.replace(/\s/g, '')
    const dataArr = data.split(';')
    let obj = {}
    for (const item of dataArr) {
      let arr = item.split('=')
      obj[arr[0]] = arr[1]
    }
    return obj
  },
  get(key) {
    return this.getAll().key
  }
}
