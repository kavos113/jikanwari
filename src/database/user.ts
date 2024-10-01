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

        new Promise((resolve, reject) => {
          db.serialize(() => {
            if (userTimetables.length === 0) resolve()
            for (let i = 0; i < userTimetables.length; i++) {
              const userTimetable = userTimetables[i]
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

                  userTimetable.room = room.room
                }
              )
              db.get(
                `
                  SELECT course_title
                  FROM courses
                  WHERE id = ?
                `,
                userTimetable.course_id,
                (err, course_title) => {
                  if (err) {
                    reject(err)
                  }

                  userTimetable.course_title = course_title.course_title
                }
              )
              db.get(
                `
                  SELECT name
                  FROM lecturers
                  WHERE course_id = ?
                  LIMIT 1
                `,
                userTimetable.course_id,
                (err, lecturer) => {
                  if (err) {
                    reject(err)
                  }

                  userTimetable.lecturer = lecturer.name

                  if (i === userTimetables.length - 1) resolve()
                }
              )
            }
          })
        })
          .then(() => {
            resolve(userTimetables)
          })
          .catch((err) => {
            reject(err)
          })
      }
    )
  })
}
