export interface UserTimetable {
  id: number
  course_id: number
  course_title: string
  lecturer: string
  year: number
  quarter: number
  day_of_week: string
  period: number
  room: string | undefined
}

export interface Quarter {
  year: number
  quarter: number
}

export interface TimetableItem {
  isDefined: boolean
  title: string
  lecturer: string
  room: string
}
