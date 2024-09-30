export interface Course {
  code: string
  title: CourseTitle
  lecturer: Lecturer[]
  department: string
  start: string
  sylbs_update: string
}

export interface CourseTitle {
  title: string
  url: string
}

export interface Lecturer {
  name: string
  url: string
}

export interface CourseDetail {
  code: string
  title: string
  english_title: string
  lecturer: Lecturer[]
  department: string
  start: string
  sylbs_update: string
  lecture_type: string
  language: string
  detailsHTML: string
  credits: number
  timetable: Timetable[]
}

export interface Timetable {
  course_id: number | undefined
  day_of_week: string
  period: number
  room: string | undefined
}

export interface TimetableDisplay {
  day_of_week: string
  period: string
  room: string | undefined
}

export interface CourseListItem {
  id: number
  code: string
  title: string
  english_title: string
  lecturer: Lecturer[]
  department: string
  start: string
  timetable: TimetableDisplay[]
  credits: number
  lecture_type: string
  language: string
}
