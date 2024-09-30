<script setup lang="ts">
import { CourseListItem } from '../../../../types/course.js'
import { ref } from 'vue'
import CourseListCard from '@renderer/components/list/CourseListCard.vue'

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

const isDetail = ref<boolean>(false)

const timetable = ref<string[]>([])
data.value.forEach((item) => {
  const text = item.timetable
    .map((item) => {
      return `${item.day_of_week} ${item.period}限 ${item.room}`
    })
    .join('\n')
  timetable.value.push(text)
})
</script>

<template>
  <input id="courseDetail" v-model="isDetail" type="checkbox" />
  <label for="courseDetail">詳細表示</label>
  <div v-if="isDetail">
    <CourseListCard v-for="item in data" :key="item.code" :course="item" />
  </div>
  <div v-else>
    <table class="table">
      <thead>
        <tr>
          <th>コード</th>
          <th>講義名</th>
          <th>担当</th>
          <th>時間割</th>
          <th>開講学期</th>
          <th>開講</th>
          <th>単位数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in data" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.title }}</td>
          <td>
            <a :href="item.lecturer[0].url">{{ item.lecturer[0].name }}</a>
          </td>
          <td>{{ timetable[i] }}</td>
          <td>{{ item.start }}</td>
          <td>{{ item.department }}</td>
          <td>{{ item.credits }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 14px;
}

.table td {
  font-size: 12px;
  padding: 2px 8px;
}
</style>
