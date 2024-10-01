<script setup lang="ts">
import TimeTableHeader from '@renderer/components/timetable/TimeTableHeader.vue'
import TimeTableMain from '@renderer/components/timetable/TimeTableMain.vue'

const isEditModel = defineModel({
  key: 'isEditModel',
  default: false
})
</script>

<template>
  <div>
    <TimeTableHeader />
    <TimeTableMain />
  </div>
</template>

<style scoped></style>
