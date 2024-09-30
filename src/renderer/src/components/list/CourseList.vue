<script setup lang="ts">
import CourseListTable from '@renderer/components/list/CourseListTable.vue'
import CourseListHeader from '@renderer/components/list/CourseListHeader.vue'
import { CourseListItem } from '../../../../types/course.js'
import { ref } from 'vue'
import { SearchQuery } from '../../../../types/search.js'

const data = ref<CourseListItem[]>([
  {
    code: 'PHY.S209',
    title: '熱力学（物理）(講義）',
    english_title: 'Thermodynamics (Physics) (Lecture)',
    lecturer: [
      {
        name: '笹本 智弘',
        url: 'https://www.ocw.titech.ac.jp/index.php?module=General&action=StaffInfo&id=489'
      }
    ],
    department: '物理学系',
    start: '2024年度 3Q',
    lecture_type: '講義 (対面型)',
    language: '日本語',
    credits: 1,
    timetable: [
      {
        day_of_week: '火',
        period: '3-4',
        room: 'M-178(H1101)'
      }
    ]
  }
])

const search = async (query: SearchQuery) => {
  await window.api.pingCustom()
  console.log(JSON.parse(JSON.stringify(query)))
  const res = await window.api.search(JSON.parse(JSON.stringify(query)))
  console.log(res)
  data.value = res
}
</script>

<template>
  <div>
    <h1>Course List</h1>
    <CourseListHeader @change-query="search" />
    <CourseListTable :data="data" />
  </div>
</template>

<style scoped></style>
