<script setup lang="ts">
import { TimetableItem, UserTimetable } from '../../../../types/user.js'
import { ref, watch } from 'vue'
import { endTimeAdapter, periodAdapter, startTimeAdapter } from '../../../../util/adapter.js'
import TimeTableItem from '@renderer/components/timetable/TimeTableItem.vue'

const days = ['月', '火', '水', '木', '金']
const periods = ['1-2', '3-4', '5-6', '7-8', '9-10']
const initItems = () => {
  days.forEach((day) => {
    periods.forEach((period) => {
      items.value[day][periodAdapter(period)] = {
        isDefined: false,
        title: '',
        lecturer: '',
        room: ''
      }
    })
  })
}

const props = defineProps<{
  data: UserTimetable[]
}>()

const items = ref<Record<string, Record<number, TimetableItem>>>({
  月: {
    1: { isDefined: false, title: '', lecturer: '', room: '' },
    2: { isDefined: false, title: '', lecturer: '', room: '' },
    3: { isDefined: false, title: '', lecturer: '', room: '' },
    4: { isDefined: false, title: '', lecturer: '', room: '' },
    5: { isDefined: false, title: '', lecturer: '', room: '' }
  },
  火: {
    1: { isDefined: false, title: '', lecturer: '', room: '' },
    2: { isDefined: false, title: '', lecturer: '', room: '' },
    3: { isDefined: false, title: '', lecturer: '', room: '' },
    4: { isDefined: false, title: '', lecturer: '', room: '' },
    5: { isDefined: false, title: '', lecturer: '', room: '' }
  },
  水: {
    1: { isDefined: false, title: '', lecturer: '', room: '' },
    2: { isDefined: false, title: '', lecturer: '', room: '' },
    3: { isDefined: false, title: '', lecturer: '', room: '' },
    4: { isDefined: false, title: '', lecturer: '', room: '' },
    5: { isDefined: false, title: '', lecturer: '', room: '' }
  },
  木: {
    1: { isDefined: false, title: '', lecturer: '', room: '' },
    2: { isDefined: false, title: '', lecturer: '', room: '' },
    3: { isDefined: false, title: '', lecturer: '', room: '' },
    4: { isDefined: false, title: '', lecturer: '', room: '' },
    5: { isDefined: false, title: '', lecturer: '', room: '' }
  },
  金: {
    1: { isDefined: false, title: '', lecturer: '', room: '' },
    2: { isDefined: false, title: '', lecturer: '', room: '' },
    3: { isDefined: false, title: '', lecturer: '', room: '' },
    4: { isDefined: false, title: '', lecturer: '', room: '' },
    5: { isDefined: false, title: '', lecturer: '', room: '' }
  }
})

watch(props, () => {
  initItems()
  props.data.forEach((item) => {
    items.value[item.day_of_week][item.period] = {
      isDefined: true,
      title: item.course_title,
      lecturer: item.lecturer,
      room: item.room
    }
  })
})
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th v-for="day in days" :key="day">
          {{ day }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="period in periods" :key="period">
        <td>
          <TimeTableItem
            :data="{
              isDefined: true,
              title: period,
              lecturer: startTimeAdapter(period),
              room: endTimeAdapter(period)
            }"
            :is-period="true"
          />
        </td>
        <td v-for="day in days" :key="day">
          <div class="item">
            <TimeTableItem :data="items[day][periodAdapter(period)]" :is-period="false" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  margin-top: 1rem;
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

.table td {
  height: 120px;
  padding: 0;
}

.table th,
.table td {
  border: 1px solid #999;
  text-align: center;
}

.item {
  width: 100%;
  height: 100%;
}
</style>
