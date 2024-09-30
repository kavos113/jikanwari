import { CourseDetail } from '../types/course.js'
import { db } from './create.js'

export const insertCourse = (course: CourseDetail) => {
  db.run(
    `
    INSERT INTO courses (
      code,
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
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
  `,
    course.code,
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
