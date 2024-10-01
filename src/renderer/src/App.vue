<script setup lang="ts">
import CourseList from '@renderer/components/list/CourseList.vue'
import Timetable from '@renderer/components/timetable/Timetable.vue'
import { ref } from 'vue'
import { Quarter, UserTimetable } from '../../types/user.js'
import { CourseListItem } from '../../types/course.js'

const isEditTimetable = ref<boolean>(false)
const quarter = ref<Quarter>({})
const courseList = ref<InstanceType<typeof CourseList> | null>(null)
const timetable = ref<InstanceType<typeof Timetable> | null>(null)

const postTimetable = async (course: CourseListItem) => {
  const req: UserTimetable[] = []
  course.timetable.forEach((time) => {
    req.push({
      course_id: course.id,
      year: quarter.value.year,
      quarter: quarter.value.quarter,
      day_of_week: time.day_of_week,
      period: time.period,
      room: time.room
    })
  })

  console.log(req)

  await window.api.postUserTimetable(req)

  if (timetable.value) {
    timetable.value.getTimetable()
  }
}

const openDetail = (id: number) => {
  if (courseList.value) {
    if (isEditTimetable.value) {
      window.api.deleteUserTimetable(quarter.value.year, quarter.value.quarter, id)
      if (timetable.value) {
        timetable.value.getTimetable()
      }
    } else {
      courseList.value.openDetail(id)
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <CourseList
      ref="courseList"
      v-model:is-edit-timetable="isEditTimetable"
      @post-timetable="postTimetable"
    />
    <Timetable
      ref="timetable"
      v-model:is-edit-model="isEditTimetable"
      v-model:quarter-model="quarter"
      @open-detail="openDetail"
    />
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 2rem);
}
</style>
