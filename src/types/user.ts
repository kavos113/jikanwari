export interface UserTimetable {
  id: number
  course_id: number
  year: number
  quarter: number
  day_of_week: string
  period: number
  room: string | undefined
}
