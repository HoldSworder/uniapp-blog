export default class Tool {
  static delHtmlTag(str: String) {
    return str.replace(/<[^>]+>/g, '') //正则去掉所有的html标记
  }

  static typeOf(any: any) {
    const type = Object.prototype.toString.call(any)
    return type.slice(8, -1)
  }
}
