export interface CourseId {
  id: number
}

export interface CourseSylbsUpdate {
  sylbs_update: string
}

export interface CourseFromDB {
  id: number
  code: string
  course_title: string
  english_title: string
  opening_department: string
  start: string
  credits: number
  lecture_type: string
  language: string
}

export interface CourseDetailFromDB {
  id: number
  code: string
  course_title: string
  english_title: string
  opening_department: string
  start: string
  sylbs_update: string
  lecture_type: string
  language: string
  credits: number
  details: string
}

export interface LecturerFromDB {
  name: string
  url: string
  course_id: number
}

export interface TimetableFromDB {
  course_id: number
  day_of_week: string
  period: number
  room: string
}
