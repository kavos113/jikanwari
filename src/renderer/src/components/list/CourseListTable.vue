<script setup lang="ts">
import { CourseListItem, CourseDetail } from '../../../../types/course.js'
import { ref, watch } from 'vue'
import CourseListCard from '@renderer/components/list/CourseListCard.vue'
import { periodStringAdapter } from '../../../../util/adapter.js'

const props = defineProps<{
  data: CourseListItem[]
}>()

const emits = defineEmits<{
  (event: 'getCourseDetail', id: int): void
  (event: 'postTimetable', item: CourseListItem): void
}>()

const isDetail = ref<boolean>(false)

const timetable = ref<string[]>([])

const openDetail = (i: number) => {
  emits('getCourseDetail', i)
  emits('postTimetable', props.data[i])
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
          <th>講義名</th>
          <th>担当</th>
          <th>時間割</th>
          <th>開講学期</th>
          <th>開講</th>
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
            <a :href="item.lecturer[0]?.url">{{ item.lecturer[0]?.name }}</a>
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
  height: 82%;
  overflow-y: auto;
  table-layout: fixed;
}

.table {
  width: 100%;
  max-height: 100%;
  border-collapse: collapse;
  overflow-y: auto;
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

.openDetail {
  cursor: pointer;
}

.openDetail p:hover {
  color: #42d392;
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
</style>
