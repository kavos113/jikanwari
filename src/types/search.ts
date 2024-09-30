export interface SearchQuery {
  grades: string[]
  quarters: string[]
  periods: Period[]
  department: string
  title: string
  lecturer: string
}

export interface Period {
  day_of_week: string
  period: string
}
