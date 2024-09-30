import sqlite3 from 'sqlite3'

export const db = new sqlite3.Database('./database.db')

export const createDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL ,
        grade INTEGER NOT NULL,
        course_title TEXT NOT NULL ,
        english_title TEXT NOT NULL ,
        url TEXT NOT NULL ,
        opening_department TEXT NOT NULL ,
        start TEXT NOT NULL ,
        sylbs_update TEXT NOT NULL,
        lecture_type TEXT NOT NULL,
        language TEXT NOT NULL,
        credits INTEGER NOT NULL,
        details TEXT NOT NULL
      );
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS lecturers (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        course_id INTEGER NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS timetable (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        day_of_week TEXT NOT NULL,
        period INTEGER NOT NULL,
        room TEXT,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );
    `)
    db.run(`
    CREATE TABLE IF NOT EXISTS user_timetables (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      year INTEGER NOT NULL,
      quarter INTEGER NOT NULL,
      day_of_week TEXT NOT NULL,
      period INTEGER NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    `)
  })

  console.log('Database initialized successfully')
}
