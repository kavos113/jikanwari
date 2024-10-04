<script setup lang="ts">
import { CourseDetail } from '../../../../types/course.js'
import { periodStringAdapter } from '../../../../util/adapter.js'

const props = defineProps<{
  data: CourseDetail
}>()
</script>

<template>
  <div>
    <div class="wrapper">
      <div class="title">
        <p class="jaTitle">{{ props.data.title }}</p>
        <p class="enTitle">{{ props.data.english_title }}</p>
      </div>
      <div class="data">
        <dl class="dataItem">
          <dt>開講元</dt>
          <dd>{{ props.data.department }}</dd>
        </dl>
        <dl class="dataItem">
          <dt>担当教員</dt>
          <dd>
            <a
              v-for="lecturer in props.data.lecturer"
              :key="lecturer.name"
              :href="lecturer.url"
              class="lecturerText"
            >
              {{ lecturer.name }}
            </a>
          </dd>
        </dl>
        <dl class="dataItem">
          <dt>授業形態</dt>
          <dd>{{ props.data.lecture_type }}</dd>
        </dl>
        <dl class="dataItem">
          <dt>曜日・時限(講義室)</dt>
          <dd>
            <span v-for="timetable in props.data.timetable" :key="timetable.day_of_week">
              {{ timetable.day_of_week }}{{ periodStringAdapter(timetable.period) }}限({{
                timetable.room
              }})
            </span>
          </dd>
        </dl>
        <dl class="dataItem">
          <dt>開講学期</dt>
          <dd>{{ props.data.start }}</dd>
        </dl>
        <div class="dataItem">
          <dl class="dataItemChild">
            <dt>科目コード</dt>
            <dd>{{ props.data.code }}</dd>
          </dl>
          <dl class="dataItemChild">
            <dt>単位数</dt>
            <dd>{{ props.data.credits }}</dd>
          </dl>
        </div>
        <div class="dataItem">
          <dl class="dataItemChild">
            <dt>シラバス更新日</dt>
            <dd>{{ props.data.sylbs_update }}</dd>
          </dl>
          <dl class="dataItemChild">
            <dt>言語</dt>
            <dd>{{ props.data.language }}</dd>
          </dl>
        </div>
      </div>
      <div class="details" v-html="props.data.detailsHTML"></div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem 2rem;
  font-size: 0.8rem;
}

.title {
  margin-bottom: 1rem;
  border-bottom: 2px solid #42d392;
  padding: 1rem 0 0.5rem;
}

.jaTitle {
  font-size: 2rem;
  padding-top: 1rem;
}

.data {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.dataItem {
  display: flex;
  flex-direction: row;
  margin-bottom: 0.2rem;
  width: 100%;
}

.dataItem dt {
  width: 140px;
  font-weight: bold;
}

.dataItemChild {
  display: flex;
  flex-direction: row;
  width: 50%;
}

.lecturerText {
  margin-right: 0.5rem;
}
</style>
