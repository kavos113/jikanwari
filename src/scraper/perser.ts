import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { rehypeExtendedTable } from 'rehype-extended-table'
import { Course, CourseTitle, Lecturer } from './type.js'
import { fetched } from './fetched'

const getCode = (td): string => {
  if (!td.children[0]) return ''

  return td.children[0].value
}

const getCourseTitle = (td): CourseTitle => {
  const a = td.children.filter((node) => node.tagName === 'a')[0]
  return {
    title: a.children[0].value.trim(),
    url: 'https://www.ocw.titech.ac.jp' + a.properties.href
  }
}

const getLecturers = (td): Lecturer[] => {
  const as = td.children.filter((node) => node.tagName === 'a')
  return as.map((a) => {
    const name = a.children[0].value.trim().replace(/[ \n\t]+/, ' ')
    return {
      name: name,
      url: 'https://www.ocw.titech.ac.jp' + a.properties.href
    }
  })
}

const getOpeningDepartment = (td): string => {
  const a = td.children.filter((node) => node.tagName === 'a')[0]
  return a.children[0].value.trim()
}

const getStart = (td): string => {
  return td.children[0].value
}

const getSylbs = (td): string => {
  return td.children[0].value.trim()
}

export const html2Courses = async (html: string): Promise<Course[]> => {
  // dev mode TODO
  html = fetched

  let hast

  await unified()
    .use(rehypeParse)
    .use(rehypeExtendedTable)
    .use(() => (tree) => {
      hast = tree
    })
    .use(rehypeStringify)
    .process(html)

  const body = hast.children
    .filter((node) => node.tagName === 'html')[0]
    .children.filter((node) => node.tagName === 'body')[0]
  const table = body.children
    .filter((node) => node.properties?.id?.includes('all-wrapper'))[0]
    .children.filter((node) => node.properties?.id?.includes('wrapper'))[0]
    .children.filter((node) => node.properties?.id?.includes('right-contents'))[0]
    .children.filter((node) => node.properties?.className?.includes('right-inner'))[0]
    .children.filter((node) => node.properties?.className?.includes('scroll_div'))[0]
    .children.filter((node) => node.tagName === 'table')[0]
  const tbody = table.children.filter((node) => node.tagName === 'tbody')[0]
  const rows = tbody.children.filter((node) => node.tagName === 'tr')

  const courses: Course[] = []

  for (const row of rows) {
    const code = getCode(
      row.children.filter((node) => node.properties?.className?.includes('code'))[0]
    )
    const course_title = getCourseTitle(
      row.children.filter((node) => node.properties?.className?.includes('course_title'))[0]
    )
    const lecturer = getLecturers(
      row.children.filter((node) => node.properties?.className?.includes('lecturer'))[0]
    )
    const opening_department = getOpeningDepartment(
      row.children.filter((node) => node.properties?.className?.includes('opening_department'))[0]
    )
    const start = getStart(
      row.children.filter((node) => node.properties?.className?.includes('start'))[0]
    )
    const sylbs = getSylbs(
      row.children.filter((node) => node.properties?.className?.includes('sylbs'))[0]
    )

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
