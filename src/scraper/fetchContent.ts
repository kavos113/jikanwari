const url: string =
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=1&lang=JA'

const res = await fetch(url)
const html = await res.text()
console.log(html)

export {}
