<script setup lang="ts">
import CourseListTable from '@renderer/components/list/CourseListTable.vue'
import CourseListHeader from '@renderer/components/list/CourseListHeader.vue'
import { CourseDetail, CourseListItem } from '../../../../types/course.js'
import { ref } from 'vue'
import { SearchQuery } from '../../../../types/search.js'
import CourseDetailView from '@renderer/components/list/CourseDetailView.vue'

const data = ref<CourseListItem[]>([])

const isEditTimetableModel = defineModel<boolean>('isEditTimetable')

const emits = defineEmits<{
  (event: 'postTimetable', course: CourseListItem): void
}>()

const isShowCourseDetail = ref<boolean>(false)
const isShowCourseDetailOverlay = ref<boolean>(false)

const detailData = ref<CourseDetail>({
  id: 0,
  code: '',
  title: '',
  english_title: '',
  lecturer: [],
  department: '',
  start: '',
  sylbs_update: '',
  lecture_type: '',
  language: '',
  detailsHTML: '',
  credits: 0,
  timetable: []
})

const openDetail = async (id: number) => {
  if (isEditTimetableModel.value) return
  console.log(id)
  detailData.value = await window.api.getCourse(id)
  console.log(detailData.value)
  isShowCourseDetail.value = true
  isShowCourseDetailOverlay.value = true
}

const closeDetail = async () => {
  isShowCourseDetail.value = false
  await new Promise((resolve) => setTimeout(resolve, 250))
  isShowCourseDetailOverlay.value = false
}

const postTimetable = async (course: CourseListItem) => {
  if (isEditTimetableModel.value) {
    emits('postTimetable', course)
  }
}

const search = async (query: SearchQuery) => {
  await window.api.pingCustom()
  console.log(JSON.parse(JSON.stringify(query)))
  const res = await window.api.search(JSON.parse(JSON.stringify(query)))
  console.log(res)

  data.value = res
}

defineExpose({
  openDetail
})
</script>

<template>
  <div class="wrapper">
    <h1>Course List</h1>
    <CourseListHeader @change-query="search" />
    <CourseListTable :data="data" @get-course-detail="openDetail" @post-timetable="postTimetable" />
  </div>
  <CourseDetailView
    :data="detailData"
    class="detail"
    :class="{ detailActive: isShowCourseDetail }"
  />
  <div
    class="overlay"
    :class="{ overlayActive: isShowCourseDetail, overlayZIndex: isShowCourseDetailOverlay }"
    @click="closeDetail"
  ></div>
</template>

<style scoped>
.wrapper {
  height: 100%;
  overflow-x: visible;
  overflow-y: auto;
}

.detail {
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  width: 60%;
  height: 100%;
  overflow-y: scroll;
  z-index: 2;
  transform: translateX(110%);
  transition-property: transform;
  transition-duration: 0.25s;
  box-shadow: -5px 0 5px rgba(0, 0, 0, 0.3);
}

.detailActive {
  z-index: 2;
  transform: translateX(0);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
  opacity: 0;
  transition-property: opacity;
  transition-duration: 0.25s;
}

.overlayActive {
  z-index: 1;
  opacity: 1;
}

.overlayZIndex {
  z-index: 1;
}
</style>
