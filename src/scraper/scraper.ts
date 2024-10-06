import { html2Courses } from './mainParser.js'
import { html2CourseDetail } from './detailParser.js'
import { insertCourse, needAction, updateCourse } from '../database/courses.js'
import { BrowserWindow } from 'electron'

const mainUrls = [
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=1&lang=JA', //理学院
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=4&lang=JA', // 情報
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=2&lang=JA', //工学院
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=3&lang=JA', // 物質
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=5&lang=JA', // 生命
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=6&lang=JA', // 環社
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=10&lang=JA', // 初年専門
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=11&lang=JA', // 共通
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=7&lang=JA' // 教養
]

const url2 = []

export const scrape = async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  for (const url of mainUrls) {
    mainWindow.webContents.send('scraping-status', 'scraping courses')
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const res = await fetch(url)
    const html = await res.text()

    const courses = html2Courses(html)

    mainWindow.webContents.send('scraping-count', courses.length)
    mainWindow.webContents.send('scraping-status', 'scraping detail')

    let scraped = 0
    const start = performance.now()

    for (const course of courses) {
      if (course.code === '') {
        scraped++
        console.log('scraping course: ', course.code, 'skip')
        mainWindow.webContents.send('scraping-count-finish', scraped)
        continue
      }

      const status = await needAction(
        course.code,
        course.sylbs_update,
        course.title.title,
        course.start
      )
      // const status = await needActionTest(course.code)

      if (status === 'skip' || status === 'error') {
        scraped++
        console.log('scraping course: ', course.code, status)
        mainWindow.webContents.send('scraping-count-finish', scraped)
        continue
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const resp = await fetch(course.title.url)
      const htmlDetail = await resp.text()
      const courseDetail = html2CourseDetail(htmlDetail)

      if (status === 'insert') {
        await insertCourse(courseDetail, course.title.url)
      } else {
        await updateCourse(courseDetail, course.title.url)
      }

      scraped++
      console.log('scraping course: ', course.code, status, courseDetail.english_title)
      const time = performance.now() - start
      const more = (time * (courses.length - scraped)) / scraped / 1000
      const moreMin = Math.floor(more / 60)
      const moreSec = Math.floor(more % 60)

      mainWindow.webContents.send(
        'scraping-status',
        `scraping detail 残り${moreMin}分${moreSec}秒 経過${Math.floor(time / 1000 / 60)}分${Math.floor((time / 1000) % 60)}秒 取得:${course.title.title}`
      )
      mainWindow.webContents.send('scraping-count-finish', scraped)
    }

    mainWindow.webContents.send('scraping-status', 'finish scraping')
  }
}

export const scrape_test = async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0]

  mainWindow.webContents.send('scraping-status', 'scraping courses')

  console.log('start scraping courses')
  const res = await fetch(
    'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=1&lang=JA'
  )
  const html = await res.text()

  const courses = html2Courses(html)

  mainWindow.webContents.send('scraping-count', courses.length)
  mainWindow.webContents.send('scraping-status', 'finish scraping courses')
  console.log('finish scraping courses')

  const course = courses[0]

  let scraped = 0

  mainWindow.webContents.send('scraping-status', 'scraping course detail')

  const start = performance.now()

  const status = await needAction(
    course.code,
    course.sylbs_update,
    course.title.title,
    course.start
  )
  //const status = await needAction('ART.T548', '2024/7/4')
  if (status === 'skip' || status === 'error') return

  const res2 = await fetch(course.title.url)
  const html2 = await res2.text()
  const courseDetail = html2CourseDetail(html2)

  console.log('status: ', status)

  if (status === 'insert') {
    await insertCourse(courseDetail, course.title.url)
  } else {
    await updateCourse(courseDetail, course.title.url)
  }

  scraped++

  const time = performance.now() - start

  const more = (time * (courses.length - scraped)) / 1000
  const moreMin = Math.floor(more / 60)
  const moreSec = Math.floor(more % 60)

  mainWindow.webContents.send(
    'scraping-status',
    `scraping course detail 残り${moreMin}分 ${moreSec}秒`
  )

  await new Promise((resolve) => setTimeout(resolve, 3000))

  mainWindow.webContents.send('scraping-count-finish', scraped)
  mainWindow.webContents.send('scraping-status', 'finish scraping')

  await new Promise((resolve) => setTimeout(resolve, 3000))
  console.log('finish scraping')
}
