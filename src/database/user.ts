import { db } from './create.js'
import { UserTimetable } from '../types/user.js'

const insertUserTimetable = async (userTimetable: UserTimetable): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
    INSERT INTO user_timetables (course_id, year, quarter, day_of_week, period)
    VALUES (?, ?, ?, ?, ?)
  `,
      userTimetable.course_id,
      userTimetable.year,
      userTimetable.quarter,
      userTimetable.day_of_week,
      userTimetable.period
    )
    resolve('success')
  })
}

const deleteUserTimetable = async (year: number, quarter: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
    DELETE FROM user_timetables
    WHERE year = ? AND quarter = ?
  `,
      year,
      quarter
    )
    resolve('success')
  })
}

export const postUserTimetable = async (userTimetables: UserTimetable[]): Promise<void> => {
  await deleteUserTimetable(userTimetables[0].year, userTimetables[0].quarter)
  for (const userTimetable of userTimetables) {
    await insertUserTimetable(userTimetable)
  }
}

export const getUserTimetable = async (year: number, quarter: number): Promise<UserTimetable[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `
    SELECT * FROM user_timetables
    WHERE year = ? AND quarter = ?
  `,
      year,
      quarter,
      (err, rows) => {
        if (err) {
          reject(err)
        }

        const userTimetables: UserTimetable[] = rows.map((row) => {
          return {
            id: row.id,
            course_id: row.course_id,
            year: row.year,
            quarter: row.quarter,
            day_of_week: row.day_of_week,
            period: row.period
          }
        })

        // get room from timetable
        userTimetables.forEach((userTimetable) => {
          db.get(
            `
              SELECT room
              FROM timetable
              WHERE course_id = ?
                AND day_of_week = ?
                AND period = ?
            `,
            userTimetable.course_id,
            userTimetable.day_of_week,
            userTimetable.period,
            (err, room) => {
              if (err) {
                reject(err)
              }

              userTimetable.room = room
            }
          )
        })

        resolve(userTimetables)
      }
    )
  })
}
