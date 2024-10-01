// 1-2 -> 1, 3-4 -> 2, 5-6 -> 3, 7-8 -> 4, 9-10 -> 5
export const periodAdapter = (periodString: string): number => {
  switch (periodString) {
    case '1-2':
      return 1
    case '3-4':
      return 2
    case '5-6':
      return 3
    case '7-8':
      return 4
    case '9-10':
      return 5
    default:
      throw new Error(`Invalid period string: ${periodString}`)
  }
}

export const periodStringAdapter = (period: number): string => {
  switch (period) {
    case 1:
      return '1-2'
    case 2:
      return '3-4'
    case 3:
      return '5-6'
    case 4:
      return '7-8'
    case 5:
      return '9-10'
    default:
      throw new Error(`Invalid period number: ${period}`)
  }
}

export const startTimeAdapter = (period: string): string => {
  switch (period) {
    case '1-2':
      return '8:50'
    case '3-4':
      return '10:45'
    case '5-6':
      return '13:30'
    case '7-8':
      return '15:25'
    case '9-10':
      return '17:15'
    default:
      throw new Error(`Invalid period string: ${period}`)
  }
}

export const endTimeAdapter = (period: string): string => {
  switch (period) {
    case '1-2':
      return '10:30'
    case '3-4':
      return '12:25'
    case '5-6':
      return '15:10'
    case '7-8':
      return '17:05'
    case '9-10':
      return '18:55'
    default:
      throw new Error(`Invalid period string: ${period}`)
  }
}
