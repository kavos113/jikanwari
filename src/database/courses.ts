import { CourseDetail, CourseListItem, Timetable } from '../types/course.js'
import { db } from './create.js'
import { SearchQuery } from '../types/search.js'

export const insertCourse = async (course: CourseDetail) => {
  return new Promise((resolve, reject) => {
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
      course.title.title,
      course.english_title,
      course.title.url,
      course.department,
      course.start,
      course.sylbs_update,
      course.lecture_type,
      course.language,
      course.credits,
      course.detailsHTML
    )

    db.serialize(() => {
      db.all('SELECT id FROM courses WHERE code = ?', course.code, (err, rows) => {
        if (err) {
          console.error(err)
          reject('error')
        } else {
          await insertLecturers(rows[0].id, course)
          await insertTimetable(rows[0].id, course)
        }
      })
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

export const updateCourse = async (course: CourseDetail) => {
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
      course.title.title,
      course.english_title,
      course.title.url,
      course.department,
      course.start,
      course.sylbs_update,
      course.lecture_type,
      course.language,
      course.credits,
      course.detailsHTML,
      course.code
    )

    db.serialize(() => {
      db.all('SELECT id FROM courses WHERE code = ?', course.code, (err, rows) => {
        if (err) {
          console.error(err)
          reject('error')
        } else {
          updateLecturers(rows[0].id, course)
          updateTimetable(rows[0].id, course)
        }
      })
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

export const needAction = (code: string, sylbs_update: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get('SELECT sylbs_update FROM courses WHERE code = ?', code, (err, row) => {
        if (err) {
          console.error(err)
          reject('error')
        } else {
          if (row === undefined) {
            resolve('insert')
          } else if (row.sylbs_update !== sylbs_update) {
            resolve('update')
          } else {
            resolve('skip')
          }
        }
      })
    })
  })
}

export const searchCourses = async (query: SearchQuery): CourseListItem[] => {
  return new Promise((resolve, reject) => {
    const dbQuery = `
      SELECT id,
             code,
             course_title,
             english_title,
             opening_department,
             start,
             credits,
             lecture_type,
             language
      FROM courses
      WHERE grade IN (${query.grades.join(',')})
        AND opening_department = ?
        AND start LIKE ?`

    let courses: CourseListItem[] = []
    db.serialize(() => {
      db.all(dbQuery, query.department, query.quarters[0], (err, rows) => {
        if (err) {
          console.error(err)
          reject('error')
        } else {
          courses = rows.map((row) => {
            return {
              id: row.id,
              code: row.code,
              title: row.course_title,
              english_title: row.english_title,
              department: row.opening_department,
              start: row.start,
              credits: row.credits,
              lecture_type: row.lecture_type
            }
          })
        }
      })
    })

    const getLeturerQuery = `
      SELECT name,
             url
      FROM lecturers
      WHERE course_id = ?`

    db.serialize(() => {
      courses.forEach((course) => {
        db.all(getLeturerQuery, course.id, (err, rows) => {
          if (err) {
            console.error(err)
            reject('error')
          } else {
            course.lecturer = rows.map((row) => {
              return {
                name: row.name,
                url: row.url
              }
            })
          }
        })
      })
    })

    const timetables: Timetable[] = []
    const getTimetableQuery = `
      SELECT day_of_week,
             period,
             room
      FROM timetable
      WHERE course_id = ?`
    db.serialize(() => {
      courses.forEach((course) => {
        db.all(getTimetableQuery, course.id, (err, rows) => {
          if (err) {
            console.error(err)
            reject('error')
          } else {
            const ret = rows.map((row) => {
              return {
                course_id: course.id,
                day_of_week: row.day_of_week,
                period: row.period,
                room: row.room
              }
            })
            timetables.push(...ret)
          }
        })
      })
    })

    const periods: EachPeriod[] = []

    query.periods.forEach((period) => {
      const [start, end] = period.period.split('-')
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        periods.push({
          day_of_week: period.day_of_week,
          period: i
        })
      }
    })

    courses = courses.filter((course) => {
      return timetables.some((timetable) => {
        return (
          timetable.course_id === course.id &&
          // period(検索クエリ)にtimetableで取得した曜日と時限が含まれているか
          periods.some((period) => {
            return (
              timetable.day_of_week === period.day_of_week && timetable.period === period.period
            )
          })
        )
      })
    })

    resolve(courses)
  })
}

type EachPeriod = {
  day_of_week: string
  period: number
}
