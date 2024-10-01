<script setup lang="ts">
import CourseList from '@renderer/components/list/CourseList.vue'
import Timetable from '@renderer/components/timetable/Timetable.vue'
import { ref } from 'vue'

const isEditTimetable = ref<boolean>(false)
</script>

<template>
  <div class="wrapper">
    <CourseList />
    <Timetable v-model="isEditTimetable" />
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
