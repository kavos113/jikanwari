import { Course, CourseTitle, Lecturer } from '../types/course'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

const getCode = (td): string => {
  return td.innerHTML
}

const getCourseTitle = (td): CourseTitle => {
  const a = td.querySelector('a')
  return {
    title: a.innerHTML.trim(),
    url: 'https://www.ocw.titech.ac.jp' + a.href
  }
}

const getLecturers = (td): Lecturer[] => {
  const as = td.querySelectorAll('a')

  const lecturers: Lecturer[] = []
  as.forEach((a) => {
    const name = a.innerHTML.trim().replace(/[ \n\t]+/, ' ')
    lecturers.push({
      name: name,
      url: 'https://www.ocw.titech.ac.jp' + a.href
    })
  })

  return lecturers
}

const getOpeningDepartment = (td): string => {
  const a = td.querySelector('a')
  return a.innerHTML.trim()
}

const getStart = (td): string => {
  return td.innerHTML.replace('&nbsp;', ' ').trim()
}

const getSylbs = (td): string => {
  return td.innerHTML.trim()
}

export const html2Courses = (html: string): Course[] => {
  const dom = JSDOM.fragment(html)
  const rows = dom.querySelector('.ranking-list').querySelector('tbody').rows

  const courses: Course[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i)

    const code = getCode(row.querySelector('.code'))
    const course_title = getCourseTitle(row.querySelector('.course_title'))
    const lecturer = getLecturers(row.querySelector('.lecturer'))
    const opening_department = getOpeningDepartment(row.querySelector('.opening_department'))
    const start = getStart(row.querySelector('.start'))
    const sylbs = getSylbs(row.querySelector('.sylbs'))

    const course: Course = {
      code,
      title: course_title,
      lecturer: lecturer,
      department: opening_department,
      start,
      sylbs_update: sylbs
    }

    courses.push(course)
  }

  return courses
}
