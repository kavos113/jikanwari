<script setup lang="ts">
import CourseList from '@renderer/components/list/CourseList.vue'
import Timetable from '@renderer/components/timetable/Timetable.vue'
</script>

<template>
  <div class="wrapper">
    <CourseList />
    <Timetable />
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
