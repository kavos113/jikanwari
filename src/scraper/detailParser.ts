import { CourseDetail, Lecturer, Timetable } from '../types/course'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

const getTitleDetail = (
  div
): {
  title: string
  english_title: string
} => {
  const text = div.querySelector('h3').innerHTML
  const [title, english_title] = text.split('&nbsp;&nbsp;&nbsp;')

  return {
    title: title.slice(7), //2024年度＜スペース＞
    english_title: english_title.trim()
  }
}

const getDepartment = (dl): string => {
  return dl.querySelector('dd').innerHTML.trim()
}

const getLecturers = (dl): Lecturer[] => {
  const as = dl.querySelectorAll('a')
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

const getLectureType = (dl): string => {
  return dl
    .querySelector('dd')
    .innerHTML.replaceAll('&nbsp;', ' ')
    .trim()
    .replace(/[ \n\t]+/, ' ')
}

const getTimetable = (dl): Timetable[] => {
  const text = dl.querySelector('dd').innerHTML

  if (text === '') return []

  const infos = text.split('&nbsp;&nbsp;').slice(0, -1)

  const timetable: Timetable[] = []
  infos.forEach((info) => {
    info = info.trim()
    const day_of_week = info[0]
    const firstBracket = info.indexOf('(')

    let room, period
    if (firstBracket === -1) {
      room = undefined
      period = info.slice(1)
    } else {
      room = info.slice(firstBracket + 1, -1)
      period = info.slice(1, firstBracket)
    }

    const [start, end] = period.split('-')
    // 1-2 -> 1, 1, 5-8 -> 3, 4 など
    const startI = (parseInt(start) + 1) / 2
    const endI = (parseInt(end) + 1) / 2

    for (let i = startI; i <= endI; i++) {
      timetable.push({
        day_of_week,
        period: i,
        room
      })
    }
  })

  return timetable
}

const getCode = (dl): string => {
  return dl.querySelector('dd').innerHTML.trim()
}

const getCredits = (dl): number => {
  return parseInt(dl.querySelector('dd').innerHTML)
}

const getStart = (dlYear, dlQuarter): string => {
  const year = dlYear.querySelector('dd').innerHTML.trim()
  const quarter = dlQuarter.querySelector('dd').innerHTML.trim()

  return `${year} ${quarter}`
}

const getSylbsUpdate = (dl): string => {
  return dl.querySelector('dd').innerHTML.trim()
}

const getLanguage = (dl): string => {
  return dl.querySelector('dd').innerHTML.trim()
}

export const html2CourseDetail = (html: string): CourseDetail => {
  const dom = JSDOM.fragment(html)
  const wrapper = dom.getElementById('right-contents')

  const { title, english_title } = getTitleDetail(wrapper.querySelector('.page-title-area'))

  const dataLists = wrapper.querySelector('.gaiyo-data').querySelectorAll('dl')

  const department = getDepartment(dataLists.item(0))
  const lecturers = getLecturers(dataLists.item(1))
  const lecture_type = getLectureType(dataLists.item(2))
  const timetable = getTimetable(dataLists.item(4))
  const code = getCode(dataLists.item(6))
  const credits = getCredits(dataLists.item(7))
  const start = getStart(dataLists.item(8), dataLists.item(9))
  const sylbs_update = getSylbsUpdate(dataLists.item(10))
  const language = getLanguage(dataLists.item(12))

  return {
    code,
    title,
    english_title,
    lecturer: lecturers,
    department,
    start,
    sylbs_update,
    lecture_type,
    language,
    detailsHTML: dom.getElementById('overview').outerHTML,
    credits,
    timetable
  }
}
