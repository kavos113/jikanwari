<script setup lang="ts">
import CourseList from '@renderer/components/list/CourseList.vue'
import Timetable from '@renderer/components/timetable/Timetable.vue'
import { ref } from 'vue'
import { Quarter, UserTimetable } from '../../types/user.js'
import { CourseListItem } from '../../types/course.js'

const isEditTimetable = ref<boolean>(false)
const quarter = ref<Quarter>({})

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
}
</script>

<template>
  <div class="wrapper">
    <CourseList v-model:is-edit-timetable="isEditTimetable" @post-timetable="postTimetable" />
    <Timetable v-model:is-edit-model="isEditTimetable" v-model:quarter-model="quarter" />
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
