<script setup lang="ts">
import { CourseListItem } from '../../../../types/course.js'
import { ref } from 'vue'
import { periodStringAdapter } from '../../../../util/adapter.js'

const props = defineProps<{
  course: CourseListItem
}>()

const timetable = ref<string>('')
props.course.timetable.forEach((time) => {
  timetable.value += `${time.day_of_week}${periodStringAdapter(time.period)}限 ${time.room} `
})
</script>

<template>
  <div class="card">
    <div class="titles">
      <p class="title">{{ props.course.title }}</p>
      <p class="enTitle">{{ props.course.english_title }}</p>
    </div>
    <div class="lecturer">
      <p>担当</p>
      <p v-for="lecturer in props.course.lecturer" :key="lecturer.name">
        <a :href="lecturer.url">{{ lecturer.name }}</a>
      </p>
    </div>
    <div class="timeInfo">
      <div class="timeInfoWrapper">
        <p>{{ props.course.start }}</p>
        <p>{{ timetable }}</p>
        <p>{{ props.course.credits }}単位</p>
      </div>
    </div>
    <div class="code">
      <p>{{ props.course.code }}</p>
    </div>
    <div class="department">
      <p>{{ props.course.department }}</p>
    </div>
    <div class="lectureType">
      <p>{{ props.course.lecture_type }}</p>
    </div>
    <div class="language">
      <p>{{ props.course.language }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.titles {
  grid-column: 1 / 4;
  grid-row: 1 / 3;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
}

.title {
  grid-row: 1 / 4;
  font-size: 1.5rem;
  vertical-align: middle;
}

.enTitle {
  grid-row: 4;
  font-size: 0.8rem;
}

.lecturer {
  grid-column: 1 / 4;
  grid-row: 3;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.timeInfo {
  grid-column: 1 / 4;
  grid-row: 4;
}

.timeInfoWrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.code {
  grid-column: 4;
  grid-row: 1;
}

.department {
  grid-column: 4;
  grid-row: 2;
}

.lectureType {
  grid-column: 4;
  grid-row: 3;
}

.language {
  grid-column: 4;
  grid-row: 4;
}
</style>
