<script setup lang="ts">
import SimpleButton from '@renderer/components/common/SimpleButton.vue'
import { ref, watch } from 'vue'

const emits = defineEmits<{
  (event: 'getTimetable'): void
}>()

const yearModel = defineModel<number>('yearModel')
const quarterNumberModel = defineModel<number>('quarterNumberModel')
const isEditModel = defineModel<boolean>('isEditModel', {
  default: false
})

const isNowFetching = ref<boolean>(false)
const year = ref<number>(0)
const quarter = ref<number>(0)
const fetchStatus = ref<string>('')
const fetchedCount = ref<number>(0)
const fetchCountAll = ref<number>(0)

const fetchTest = () => {
  isNowFetching.value = true
  window.api.scrapeTest().then(() => {
    isNowFetching.value = false
  })
}

const fetch = () => {
  isNowFetching.value = true
  window.api.scrape().then(() => {
    isNowFetching.value = false
  })
}

const clickEdit = () => {
  isEditModel.value = !isEditModel.value
}

window.api.onChangeScrapingStatus((status) => {
  fetchStatus.value = status
})

window.api.onChangeScrapingCount((count) => {
  fetchCountAll.value = count
})

window.api.onChangeScrapingCountFinish((count) => {
  fetchedCount.value = count
})

watch(year, (newVal) => {
  yearModel.value = parseInt(newVal.toString())
  if (!isEditModel.value) {
    emits('getTimetable')
  }
})

watch(quarter, (newVal) => {
  quarterNumberModel.value = parseInt(newVal.toString())
  if (!isEditModel.value) {
    emits('getTimetable')
  }
})
</script>

<template>
  <div>
    <div class="wrapper">
      <SimpleButton :class="{ disabled: isNowFetching }" @click="fetch">Fetch</SimpleButton>
      <SimpleButton :class="{ disabled: isNowFetching }" @click="fetchTest"
        >Fetch(Test)</SimpleButton
      >
      <SimpleButton @click="clickEdit">Edit</SimpleButton>
      <input v-model.lazy="year" type="text" class="input" />
      <p>年</p>
      <input v-model.lazy="quarter" type="text" class="input" />
      <p>Ｑ</p>
      <p v-if="isEditModel">編集モード</p>
    </div>
    <div v-if="isNowFetching">
      <p>進行状況: {{ fetchStatus }}</p>
      <p>取得完了: {{ fetchedCount }} / {{ fetchCountAll }}</p>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.input {
  width: 1rem;
  padding: 0.2rem 0.5rem;
  font-size: 1.2rem;
}

.disabled {
  color: #ccc;
  cursor: not-allowed;
  pointer-events: none;
}

.disabled:hover {
  border: 1px solid transparent;
}
</style>
