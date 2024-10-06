<script setup lang="ts">
import { TimetableItem } from '../../../../types/user.js'

const props = defineProps<{
  data: TimetableItem
  isPeriod: boolean
}>()
</script>

<template>
  <div class="wrapper">
    <div class="titleWrapper">
      <div class="pWrapper">
        <p class="title" :class="{ period: props.isPeriod }">{{ props.data.title }}</p>
      </div>
    </div>
    <div class="lecturerWrapper">
      <div class="pWrapper">
        <p class="lecturer">{{ props.data.lecturer }}</p>
      </div>
    </div>
    <div class="roomWrapper">
      <div class="pWrapper">
        <p class="room">{{ props.data.room }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-rows: repeat(5, 24px);
  width: 100%;
  height: 100%;
  font-size: 0.8rem;
  align-content: center;
}

.pWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
}

.titleWrapper {
  grid-row: 1 / 4;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.lecturerWrapper {
  grid-row: 4;
  border-bottom: 1px solid #e0e0e0;
}

.lecturer {
  margin: auto 0;
}

.roomWrapper {
  grid-row: 5;
}

.room {
  margin: auto;
}

.period {
  font-size: 2rem;
}
</style>
