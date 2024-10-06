<script setup lang="ts">
import { CourseListItem } from '../../../../types/course.js'
import { ref, watch } from 'vue'
import CourseListCard from '@renderer/components/list/CourseListCard.vue'
import { periodStringAdapter } from '../../../../util/adapter.js'

const props = defineProps<{
  data: CourseListItem[]
}>()

const emits = defineEmits<{
  (event: 'getCourseDetail', id: int): void
  (event: 'postTimetable', item: CourseListItem): void
  (event: 'setLecturer', item: string): void
  (event: 'sort', target: string, order: 'desc' | 'asc'): void
}>()

const isDetail = ref<boolean>(false)

const timetable = ref<string[]>([])

const openDetail = (i: number) => {
  emits('getCourseDetail', i)
  emits('postTimetable', props.data.find((item) => item.id === i)!)
}
watch(props, () => {
  timetable.value = []
  props.data.forEach((item) => {
    const text = item.timetable
      .map((item) => {
        return `${item.day_of_week}${periodStringAdapter(item.period)}`
      })
      .join(' ')
    timetable.value.push(text)
    item.code = item.code.slice(0, 9)
  })
})

const setLecturer = (lecturer: string) => {
  if (lecturer) emits('setLecturer', lecturer)
}

type Sort = 'asc' | 'desc' | null
type SortTarget = 'title' | 'lecturer' | 'department' | 'start'
const titleSort = ref<Sort>(null)
const lecturerSort = ref<Sort>(null)
const departmentSort = ref<Sort>(null)
const startSort = ref<Sort>(null)

const sort = (target: SortTarget) => {
  switch (target) {
    case 'title':
      lecturerSort.value = null
      departmentSort.value = null
      startSort.value = null
      if (titleSort.value === 'asc') {
        titleSort.value = 'desc'
        emits('sort', 'title', 'desc')
      } else if (titleSort.value === 'desc') {
        titleSort.value = null
      } else {
        titleSort.value = 'asc'
        emits('sort', 'title', 'asc')
      }
      break
    case 'lecturer':
      titleSort.value = null
      departmentSort.value = null
      startSort.value = null
      if (lecturerSort.value === 'asc') {
        lecturerSort.value = 'desc'
        emits('sort', 'lecturer', 'desc')
      } else if (lecturerSort.value === 'desc') {
        lecturerSort.value = null
      } else {
        lecturerSort.value = 'asc'
        emits('sort', 'lecturer', 'asc')
      }
      break
    case 'department':
      titleSort.value = null
      lecturerSort.value = null
      startSort.value = null
      if (departmentSort.value === 'asc') {
        departmentSort.value = 'desc'
        emits('sort', 'department', 'desc')
      } else if (departmentSort.value === 'desc') {
        departmentSort.value = null
      } else {
        departmentSort.value = 'asc'
        emits('sort', 'department', 'asc')
      }
      break
    case 'start':
      titleSort.value = null
      lecturerSort.value = null
      departmentSort.value = null
      if (startSort.value === 'asc') {
        startSort.value = 'desc'
        emits('sort', 'start', 'desc')
      } else if (startSort.value === 'desc') {
        startSort.value = null
      } else {
        startSort.value = 'asc'
        emits('sort', 'start', 'asc')
      }
      break
  }
}
</script>

<template>
  <input id="courseDetail" v-model="isDetail" type="checkbox" />
  <label for="courseDetail">詳細表示</label>
  <div v-if="isDetail">
    <CourseListCard v-for="item in data" :key="item.code" :course="item" />
  </div>
  <div v-else class="tableWrapper">
    <table class="table">
      <thead>
        <tr>
          <th>コード</th>
          <th @click="sort('title')">講義名</th>
          <th @click="sort('lecturer')">担当</th>
          <th>時間割</th>
          <th @click="sort('start')">開講学期</th>
          <th @click="sort('department')">開講</th>
          <th>単位数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in props.data" :key="item.id">
          <td class="openDetail code" @click="openDetail(item.id)">
            <p>{{ item.code }}</p>
          </td>
          <td class="openDetail" @click="openDetail(item.id)">
            <p>{{ item.title }}</p>
          </td>
          <td class="lecturer">
            <a class="lecturerText" @click="setLecturer(item.lecturer[0]?.name)">{{
              item.lecturer[0]?.name
            }}</a>
            <span v-if="item.lecturer.length > 1"> ほか</span>
          </td>
          <td class="timetable">{{ timetable[i] }}</td>
          <td class="start">{{ item.start }}</td>
          <td class="department">{{ item.department }}</td>
          <td class="credits">{{ item.credits }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tableWrapper {
  width: 100%;
  height: 75%;
  overflow-y: auto;
  border-top: 1px solid #ddd;
}

.table {
  width: 100%;
  max-height: 100%;
  border-collapse: collapse;
  overflow-y: auto;
}

.table th,
.table td {
  padding: 8px;
  text-align: left;
  font-size: 14px;
}

.table td {
  font-size: 12px;
  border: 1px solid #ddd;
  padding: 2px 8px;
}

.table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.openDetail {
  cursor: pointer;
}

.table tbody tr:has(.openDetail:hover) {
  box-shadow: 0 0 10px #42d392;
}

.code p {
  width: 70px;
  word-break: keep-all;
  overflow: hidden;
}

.start {
  width: 90px;
}

.department {
  width: 170px;
}

.credits {
  width: 60px;
}

.lecturer {
  width: 90px;
}

.timetable {
  width: 90px;
}

.lecturerText {
  cursor: pointer;
}

.lecturerText:hover {
  color: #42d392;
}
</style>
