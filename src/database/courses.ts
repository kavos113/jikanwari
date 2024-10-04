import { CourseDetail, CourseListItem } from '../types/course.js'
import { db } from './create.js'
import { SearchQuery } from '../types/search.js'
import { periodAdapter } from '../util/adapter.js'

export const insertCourse = async (course: CourseDetail, url: string) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      db.run(
        `
      INSERT INTO courses (
        code,
        grade,
        course_title,
        english_title,
        url,
        opening_department,
        start,
        sylbs_update,
        lecture_type,
        language,
        credits,
        details
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );
    `,
        course.code,
        parseInt(course.code[5]) * 100,
        course.title,
        course.english_title,
        url,
        course.department,
        course.start,
        course.sylbs_update,
        course.lecture_type,
        course.language,
        course.credits,
        course.detailsHTML
      )

      db.all(
        'SELECT id FROM courses WHERE code = ? AND course_title = ? AND english_title = ? AND start = ? AND url = ?',
        course.code,
        course.title,
        course.english_title,
        course.start,
        url,
        async (err, rows) => {
          if (err) {
            console.error(err)
            reject('error')
          } else {
            await insertLecturers(rows[0].id, course)
            await insertTimetable(rows[0].id, course)
          }
        }
      )
    })

    resolve('success')
  })
}

const insertLecturers = async (courseId: number, course: CourseDetail) => {
  return new Promise((resolve, reject) => {
    course.lecturer.forEach((lecturer) => {
      db.run(
        `
          INSERT INTO lecturers (name,
                                 url,
                                 course_id)
          VALUES (?, ?, ?);
        `,
        lecturer.name,
        lecturer.url,
        courseId
      )
    })
    resolve('success')
  })
}

const insertTimetable = async (courseId: number, course: CourseDetail) => {
  return new Promise((resolve, reject) => {
    course.timetable.forEach((timetable) => {
      db.run(
        `
      INSERT INTO timetable (
        course_id,
        day_of_week,
        period,
        room
      ) VALUES (
        ?, ?, ?, ?
      );
    `,
        courseId,
        timetable.day_of_week,
        timetable.period,
        timetable.room
      )
    })
    resolve('success')
  })
}

export const updateCourse = async (course: CourseDetail, url: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE courses
        SET grade              = ?,
            course_title       = ?,
            english_title      = ?,
            url                = ?,
            opening_department = ?,
            start              = ?,
            sylbs_update       = ?,
            lecture_type       = ?,
            language           = ?,
            credits            = ?,
            details            = ?
        WHERE code = ?;
      `,
      parseInt(course.code[5]) * 100,
      course.title,
      course.english_title,
      url,
      course.department,
      course.start,
      course.sylbs_update,
      course.lecture_type,
      course.language,
      course.credits,
      course.detailsHTML,
      course.code
    )

    db.serialize(async () => {
      db.all(
        'SELECT id FROM courses WHERE code = ? AND course_title = ? AND english_title = ? AND start = ? AND url = ?',
        course.code,
        course.title,
        course.english_title,
        course.start,
        url,
        async (err, rows) => {
          if (err) {
            console.error(err)
            reject('error')
          } else {
            await updateLecturers(rows[0].id, course)
            await updateTimetable(rows[0].id, course)
          }
        }
      )
    })
    resolve('success')
  })
}

const updateLecturers = async (courseId: number, course: CourseDetail) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM lecturers WHERE course_id = ?', courseId)

    course.lecturer.forEach((lecturer) => {
      db.run(
        `
      INSERT INTO lecturers (
        name,
        url,
        course_id
      ) VALUES (
        ?, ?, ?
      );
    `,
        lecturer.name,
        lecturer.url,
        courseId
      )
    })
    resolve('success')
  })
}

const updateTimetable = async (courseId: number, course: CourseDetail) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM timetable WHERE course_id = ?', courseId)

    course.timetable.forEach((timetable) => {
      db.run(
        `
          INSERT INTO timetable (course_id,
                                 day_of_week,
                                 period,
                                 room)
          VALUES (?, ?, ?, ?);
        `,
        courseId,
        timetable.day_of_week,
        timetable.period,
        timetable.room
      )
    })
    resolve('success')
  })
}

// TODO: codeだけだと A, B, Cの区別ついてない
export const needAction = async (
  code: string,
  sylbs_update: string,
  title: string,
  start: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT sylbs_update FROM courses WHERE code = ? AND course_title = ? AND start = ? `,
        code,
        title,
        start,
        (err, row) => {
          if (err) {
            console.error(err)
            reject('error')
          } else {
            if (row === undefined) {
              resolve('insert')
            } else {
              const get_update = row.sylbs_update.replace(/[年月]/g, '/').replace('日', '')
              // console.log(get_update)
              // console.log(sylbs_update)
              if (get_update !== sylbs_update) {
                resolve('update')
              } else {
                resolve('skip')
              }
            }
          }
        }
      )
    })
  })
}

export const needActionTest = async (code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(`SELECT sylbs_update FROM courses WHERE code = ? `, code, (err, rows) => {
        if (err) {
          console.error(err)
          reject('error')
        } else {
          if (rows === undefined) {
            resolve('insert')
          } else {
            if (rows.length > 1) {
              resolve('update')
            } else {
              resolve('skip')
            }
          }
        }
      })
    })
  })
}

export const searchCourses = async (query: SearchQuery): Promise<CourseListItem[]> => {
  return new Promise((resolve, reject) => {
    let dbQuery = `
      SELECT id,
             code,
             course_title,
             english_title,
             opening_department,
             start,
             credits,
             lecture_type,
             language
      FROM courses ORDER BY grade`
    const params = []

    if (query.grades.length > 0) {
      dbQuery += ` WHERE grade IN (${query.grades.join(',')})`
      if (query.department) {
        dbQuery += ` AND opening_department = ?`
        params.push(query.department)
      }
      if (query.quarters.length > 0) {
        dbQuery += ` AND (${query.quarters.map(() => 'start LIKE ?').join(' OR ')})`
        params.push(...query.quarters.map((q) => `%${q}%`))
      }
    } else {
      if (query.department) {
        dbQuery += ` WHERE opening_department = ?`
        params.push(query.department)
        if (query.quarters.length > 0) {
          dbQuery += ` AND (${query.quarters.map(() => 'start LIKE ?').join(' OR ')})`
          params.push(...query.quarters.map((q) => `%${q}%`))
        }
      } else {
        if (query.quarters.length > 0) {
          dbQuery += ` WHERE (${query.quarters.map(() => 'start LIKE ?').join(' OR ')})`
          params.push(...query.quarters.map((q) => `%${q}%`))
        }
      }
    }

    db.all(dbQuery, params, (err, rows) => {
      if (err) {
        console.log('error in firstselect')
        console.error(err)
        return reject('error')
      }

      const courses: CourseDetail[] = rows.map((row) => ({
        id: row.id,
        code: row.code,
        title: row.course_title,
        english_title: row.english_title,
        department: row.opening_department,
        start: row.start,
        credits: row.credits,
        lecture_type: row.lecture_type,
        language: row.language
      }))

      const courseIds = courses.map((course) => course.id)
      const lecturerQuery = `
        SELECT name, url, course_id
        FROM lecturers
        WHERE course_id IN (${courseIds.join(',')})
      `
      const timetableQuery = `
        SELECT day_of_week, period, room, course_id
        FROM timetable
        WHERE course_id IN (${courseIds.join(',')})
      `

      db.all(lecturerQuery, (err, lecturers) => {
        if (err) {
          console.log('error in secondselect')
          console.error(err)
          return reject('error')
        }

        db.all(timetableQuery, (err, timetables) => {
          if (err) {
            console.error(err)
            console.log('error in thirdselect')
            return reject('error')
          }

          courses.forEach((course) => {
            course.lecturer = lecturers.filter((l) => l.course_id === course.id)
            course.timetable = timetables.filter((t) => t.course_id === course.id)
          })

          const periods = query.periods.map((period) => ({
            day_of_week: period.day_of_week,
            period: periodAdapter(period.period)
          }))

          if (periods.length === 0) {
            return resolve(courses)
          }

          const filteredCourses = courses.filter((course) =>
            course.timetable.some((timetable) =>
              periods.some(
                (period) =>
                  timetable.day_of_week === period.day_of_week && timetable.period === period.period
              )
            )
          )

          resolve(filteredCourses)
        })
      })
    })
  })
}

export const getCourse = async (id: number): Promise<CourseDetail> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get('SELECT * FROM courses WHERE id = ?', id, (err, row) => {
        if (err) {
          console.error(err)
          reject('error')
        } else {
          const course: CourseDetail = {
            id: row.id,
            code: row.code,
            title: row.course_title,
            english_title: row.english_title,
            department: row.opening_department,
            start: row.start,
            sylbs_update: row.sylbs_update,
            lecture_type: row.lecture_type,
            language: row.language,
            detailsHTML: row.details,
            credits: row.credits
          }

          const lecturerQuery = `
            SELECT name, url
            FROM lecturers
            WHERE course_id = ?
          `
          const timetableQuery = `
            SELECT day_of_week, period, room
            FROM timetable
            WHERE course_id = ?
          `
          db.all(lecturerQuery, row.id, (err, lecturers) => {
            if (err) {
              console.error(err)
              reject('error')
            } else {
              course.lecturer = lecturers
              db.all(timetableQuery, row.id, (err, timetables) => {
                if (err) {
                  console.error(err)
                  reject('error')
                } else {
                  course.timetable = timetables
                  resolve(course)
                }
              })
            }
          })
        }
      })
    })
  })
}
