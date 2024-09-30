import { CourseDetail, CourseListItem, Timetable } from '../types/course.js'
import { db } from './create.js'
import { SearchQuery } from '../types/search.js'

export const insertCourse = (course: CourseDetail) => {
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
      } else {
        insertLecturers(rows[0].id, course)
        insertTimetable(rows[0].id, course)
      }
    })
  })
}

const insertLecturers = (courseId: number, course: CourseDetail) => {
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
}

const insertTimetable = (courseId: number, course: CourseDetail) => {
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
}

export const updateCourse = (course: CourseDetail) => {
  db.run(
    `
    UPDATE courses SET
      grade = ?,
      course_title = ?,
      english_title = ?,
      url = ?,
      opening_department = ?,
      start = ?,
      sylbs_update = ?,
      lecture_type = ?,
      language = ?,
      credits = ?,
      details = ?
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
      } else {
        updateLecturers(rows[0].id, course)
        updateTimetable(rows[0].id, course)
      }
    })
  })
}

const updateLecturers = (courseId: number, course: CourseDetail) => {
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
}

const updateTimetable = (courseId: number, course: CourseDetail) => {
  db.run('DELETE FROM timetable WHERE course_id = ?', courseId)

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
}

export const needAction = (code: string, sylbs_update: string): string => {
  db.get('SELECT sylbs_update FROM courses WHERE code = ?', code, (err, row) => {
    if (err) {
      console.error(err)
      return 'error'
    } else {
      if (row === undefined) {
        return 'insert'
      }

      if (row.sylbs_update !== sylbs_update) {
        return 'update'
      } else {
        return 'skip'
      }
    }
  })
}

export const searchCourses = (query: SearchQuery): CourseListItem[] => {
  const dbQuery = `
    SELECT
      id,
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
        return []
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
    SELECT
      name,
      url
      FROM lecturers
      WHERE course_id = ?`

  db.serialize(() => {
    courses.forEach((course) => {
      db.all(getLeturerQuery, course.id, (err, rows) => {
        if (err) {
          console.error(err)
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
    SELECT
      day_of_week,
      period,
      room
      FROM timetable
      WHERE course_id = ?`
  db.serialize(() => {
    courses.forEach((course) => {
      db.all(getTimetableQuery, course.id, (err, rows) => {
        if (err) {
          console.error(err)
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
          return timetable.day_of_week === period.day_of_week && timetable.period === period.period
        })
      )
    })
  })

  return courses
}

type EachPeriod = {
  day_of_week: string
  period: number
}
