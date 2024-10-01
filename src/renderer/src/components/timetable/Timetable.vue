<script setup lang="ts">
import TimeTableHeader from '@renderer/components/timetable/TimeTableHeader.vue'
import TimeTableMain from '@renderer/components/timetable/TimeTableMain.vue'
import { Quarter, UserTimetable } from '../../../../types/user.js'
import { ref } from 'vue'

const isEditModel = defineModel<boolean>('isEditModel')

const quarterModel = defineModel<Quarter>('quarterModel')

const timetable = ref<UserTimetable[]>([])

const getTimetable = async () => {
  const res = await window.api.getUserTimetable(quarterModel.value.year, quarterModel.value.quarter)
  timetable.value = res
}
</script>

<template>
  <div>
    <TimeTableHeader
      v-model:year-model="quarterModel.year"
      v-model:quarter-number-model="quarterModel.quarter"
      v-model:is-edit-model="isEditModel"
      @get-timetable="getTimetable"
    />
    <TimeTableMain :data="timetable" />
  </div>
</template>

<style scoped></style>
