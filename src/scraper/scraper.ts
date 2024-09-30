import { html2Courses } from './mainParser.js'
import { html2CourseDetail } from './detailParser.js'
import { insertCourse, needAction, updateCourse } from '../database/courses.js'

const mainUrls = [
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=1&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=2&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=3&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=4&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=5&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=6&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=7&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=10&lang=JA',
  'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=11&lang=JA'
]

export const scrape = async () => {
  for (const url of mainUrls) {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const res = await fetch(url)
    const html = await res.text()

    const courses = html2Courses(html)

    for (const course of courses) {
      const status = needAction(course.code, course.sylbs_update)
      if (status === 'skip' || status === 'error') continue

      await new Promise((resolve) => setTimeout(resolve, 3000))

      const resp = await fetch(course.url)
      const htmlDetail = await resp.text()
      const courseDetail = html2CourseDetail(htmlDetail)

      if (status === 'insert') {
        insertCourse(courseDetail)
      } else {
        updateCourse(courseDetail)
      }
    }
  }
}

export const scrape_test = async () => {
  const res = await fetch(
    'https://www.ocw.titech.ac.jp/index.php?module=General&action=T0100&GakubuCD=1&lang=JA'
  )
  const html = await res.text()

  const courses = html2Courses(html)

  const course = courses[0]

  const status = needAction(course.code, course.sylbs_update)
  if (status === 'skip' || status === 'error') return

  const res2 = await fetch(course.url)
  const html2 = await res2.text()
  const courseDetail = html2CourseDetail(html2)

  if (status === 'insert') {
    insertCourse(courseDetail)
  } else {
    updateCourse(courseDetail)
  }

  console.log('finish scraping')
}
