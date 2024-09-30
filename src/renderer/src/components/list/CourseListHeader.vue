<script setup lang="ts">
import { ref, watch } from 'vue'
import { Period, SearchQuery } from '../../../../types/search.js'
import CourseListDepartmentMenu from '@renderer/components/list/CourseListDepartmentMenu.vue'

const grades = ref<string[]>(['100', '200', '300', '400', '500', '600'])
const quarters = ref<string[]>(['1Q', '2Q', '3Q', '4Q'])
const days = ref<string[]>(['月', '火', '水', '木', '金'])
const periods = ref<string[]>(['1-2', '3-4', '5-6', '7-8', '9-10'])

const dayMap = {
  月: 2,
  火: 3,
  水: 4,
  木: 5,
  金: 6
}

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
  query.value.quarters = quartersQuery.value
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

const clickPeriod = (period: string) => {
  const isAllChecked = days.value.every((day) => {
    const checkbox = document.getElementById(`${day}-${period}`) as HTMLInputElement
    return checkbox.checked
  })

  if (isAllChecked) {
    days.value.forEach((day) => {
      const checkbox = document.getElementById(`${day}-${period}`) as HTMLInputElement
      checkbox.checked = false
      periodsQuery.value = periodsQuery.value.filter((item) => {
        return item.day_of_week !== day || item.period !== period
      })
    })
    return
  }
  days.value.forEach((day) => {
    const checkbox = document.getElementById(`${day}-${period}`) as HTMLInputElement
    if (checkbox.checked) {
      return
    }
    checkbox.checked = true
    periodsQuery.value.push({ day_of_week: day, period })
  })
}

const clickDay = (day: string) => {
  const isAllChecked = periods.value.every((period) => {
    const checkbox = document.getElementById(`${day}-${period}`) as HTMLInputElement
    return checkbox.checked
  })

  if (isAllChecked) {
    periods.value.forEach((period) => {
      const checkbox = document.getElementById(`${day}-${period}`) as HTMLInputElement
      checkbox.checked = false
      periodsQuery.value = periodsQuery.value.filter((item) => {
        return item.day_of_week !== day || item.period !== period
      })
    })
    return
  }
  periods.value.forEach((period) => {
    const checkbox = document.getElementById(`${day}-${period}`) as HTMLInputElement
    if (checkbox.checked) {
      return
    }
    checkbox.checked = true
    periodsQuery.value.push({ day_of_week: day, period })
  })
}

const depertments = {
  学士課程: {
    理学院: ['数学系', '物理学系', '化学系', '地球惑星科学系'],
    工学院: ['機械系', 'システム制御系', '電気電子系', '情報通信系', '経営工学系'],
    物質理工学院: ['材料系', '応用化学系'],
    情報理工学院: ['数理・計算科学系', '情報工学系'],
    生命理工学院: ['生命理工学系'],
    '環境・社会理工学院': ['建築学系', '土木・環境工学系', '融合理工学系'],
    '工学院，物質理工学院，環境・社会理工学院共通科目': [
      '工学院，物質理工学院，環境・社会理工学院共通科目'
    ],
    教養科目群: [
      '文系教養科目',
      '英語科目',
      '第二外国語科目',
      '日本語・日本文化科目',
      '教職科目',
      'アントレプレナーシップ科目',
      '広域教養科目',
      '理工系教養科目'
    ]
  },
  大学院課程: {
    理学院: [
      '数学コース',
      '物理学コース',
      '化学コース',
      'エネルギーコース',
      'エネルギー・情報コース',
      '地球惑星科学コース',
      '地球生命コース'
    ],
    工学院: [
      '機械コース',
      'エネルギーコース',
      'エネルギー・情報コース',
      'エンジニアリングデザインコース',
      'ライフエンジニアリングコース',
      '原子核工学コース',
      'システム制御コース',
      '電気電子コース',
      '情報通信コース',
      '経営工学コース'
    ],
    物質理工学院: [
      '材料コース',
      '応用化学コース',
      'エネルギーコース',
      'エネルギー・情報コース',
      'ライフエンジニアリングコース',
      '原子核工学コース',
      '地球生命コース'
    ],
    情報理工学院: [
      '数理・計算科学コース',
      '情報工学コース',
      '知能情報コース',
      'エネルギー・情報コース',
      'ライフエンジニアリングコース'
    ],
    生命理工学院: ['生命理工学コース', 'ライフエンジニアリングコース', '地球生命コース'],
    '環境・社会理工学院': [
      '建築学コース',
      '土木工学コース',
      '融合理工学コース',
      'エンジニアリングデザインコース',
      '都市・環境学コース',
      '地球環境共創コース',
      'エネルギーコース',
      'エネルギー・情報コース',
      '原子核工学コース',
      '社会・人間科学コース',
      'イノベーション科学コース',
      '技術経営専門職学位課程'
    ],
    教養科目群: [
      '文系教養科目',
      '英語科目',
      '第二外国語科目',
      '日本語・日本文化科目',
      '教職科目',
      'アントレプレナーシップ科目',
      '広域教養科目',
      'キャリア科目'
    ]
  }
}

const isDepartmentMenuOpen = ref(false)
const openDepartmentMenu = () => {
  isDepartmentMenuOpen.value = true
}
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
            <th class="dayHeader"></th>
            <th
              v-for="day in days"
              :key="day"
              class="dayHeader dayHeaderItem"
              :class="`col-${dayMap[day]}`"
              @click="clickDay(day)"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="period in periods" :key="period">
            <th class="periodHeader" @click="clickPeriod(period)">{{ period }}</th>
            <td v-for="day in days" :key="day">
              <input
                :id="`${day}-${period}`"
                v-model="periodsQuery"
                type="checkbox"
                :value="{ day_of_week: day, period: period }"
                class="tableCheckbox"
              />
              <label :for="`${day}-${period}`" class="tableItem"></label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div>
        <p class="departmentQuery" @click="openDepartmentMenu">{{ departmentQuery }}</p>
        <CourseListDepartmentMenu v-if="isDepartmentMenuOpen" :items="depertments" />
      </div>
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

.checkboxTable td {
  border: 1px solid #aaa;
  width: 1.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  padding: 0;
}

.tableCheckbox {
  display: none;
}

.tableItem {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition-property: box-shadow, background-color;
  transition-duration: 0.1s;
}

.tableItem:hover {
  box-shadow: 0 0 10px #42d392;
}

.periodHeader {
  width: 3rem;
  text-align: center;
  border: 1px solid #aaa;
  font-weight: 400;
  cursor: pointer;
}

.dayHeader {
  border: 1px solid #aaa;
  font-weight: 400;
}

.tableCheckbox:checked + .tableItem {
  background-color: #42d392;
}

tr {
  transition-property: box-shadow;
  transition-duration: 0.1s;
}

tr:has(.periodHeader:hover) {
  box-shadow: 0 0 10px #42d392;
}

.dayHeaderItem {
  cursor: pointer;
}

.checkboxTable:has(.col-2:hover) td:nth-child(2) {
  background-color: rgba(66, 211, 146, 0.2);
}

.checkboxTable:has(.col-3:hover) td:nth-child(3) {
  background-color: rgba(66, 211, 146, 0.2);
}

.checkboxTable:has(.col-4:hover) td:nth-child(4) {
  background-color: rgba(66, 211, 146, 0.2);
}

.checkboxTable:has(.col-5:hover) td:nth-child(5) {
  background-color: rgba(66, 211, 146, 0.2);
}

.checkboxTable:has(.col-6:hover) td:nth-child(6) {
  background-color: rgba(66, 211, 146, 0.2);
}

.departmentQuery {
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: 0.5rem;
  width: 10rem;
  height: 1rem;
  padding: 0.2rem;
}

.departmentQuery:hover {
  box-shadow: 0 0 10px #42d392;
}
</style>
