<script setup lang="ts">
import { ref, watch } from 'vue'
import { Period, SearchQuery } from '../../../../types/search.js'

const grades = ref<string[]>(['100', '200', '300', '400', '500', '600'])
const quarters = ref<string[]>(['1Q', '2Q', '3Q', '4Q'])
const days = ref<string[]>(['月', '火', '水', '木', '金'])
const periods = ref<string[]>(['1-2', '3-4', '5-6', '7-8', '9-10'])

const query = ref<SearchQuery>({
  grades: [],
  quarters: [],
  periods: [],
  department: '',
  title: '',
  lecturer: ''
})

const gradesQuery = ref<string[]>([])
const quartersQuery = ref<string[]>([])
const periodsQuery = ref<Period[]>([])
const departmentQuery = ref<string>('')
const titleQuery = ref<string>('')
const lecturerQuery = ref<string>('')

watch(gradesQuery, () => {
  query.value.grades = gradesQuery.value
})

watch(quartersQuery, () => {
  query.value.quarters = gradesQuery.value
})

watch(periodsQuery, () => {
  query.value.periods = periodsQuery.value
})

watch(departmentQuery, () => {
  query.value.department = departmentQuery.value
})

watch(titleQuery, () => {
  query.value.title = titleQuery.value
})

watch(lecturerQuery, () => {
  query.value.lecturer = lecturerQuery.value
})
</script>

<template>
  <div class="wrapper">
    <div class="grades">
      <p>番台</p>
      <ul class="checkboxList">
        <li v-for="grade in grades" :key="grade" class="listItem">
          <input :id="grade" v-model="gradesQuery" type="checkbox" :value="grade" />
          <label :for="grade">{{ grade }}</label>
        </li>
      </ul>
    </div>
    <div class="quarters">
      <p>クォーター</p>
      <ul class="checkboxList">
        <li v-for="quarter in quarters" :key="quarter" class="listItem">
          <input :id="quarter" v-model="quartersQuery" type="checkbox" :value="quarter" />
          <label :for="quarter">{{ quarter }}</label>
        </li>
      </ul>
    </div>
    <div class="schedule">
      <table class="checkboxTable">
        <thead>
          <tr>
            <th></th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="period in periods" :key="period">
            <th>{{ period }}</th>
            <td v-for="day in days" :key="day">
              <input
                v-model="periodsQuery"
                type="checkbox"
                :value="{ day_of_week: day, period: period }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div>
    {{ query }}
  </div>
</template>

<style scoped>
.listItem {
  list-style: none;
}

.checkboxList {
  padding: 0;
}

.wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.checkboxTable {
  border-collapse: collapse;
}
</style>
