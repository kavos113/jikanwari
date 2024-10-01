<script setup lang="ts">
import SimpleButton from '@renderer/components/common/SimpleButton.vue'
import { ref } from 'vue'

const isNowFetching = ref<boolean>(false)

const fetchTest = () => {
  isNowFetching.value = true
  window.api.scrapeTest().then(() => {
    isNowFetching.value = false
  })
}
</script>

<template>
  <div class="wrapper">
    <SimpleButton>Fetch</SimpleButton>
    <SimpleButton :class="{ disabled: isNowFetching }" @click="fetchTest">Fetch(Test)</SimpleButton>
    <SimpleButton>Edit</SimpleButton>
    <input type="text" class="input" />
    <p>年</p>
    <input type="text" class="input" />
    <p>Ｑ</p>
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
}

.disabled:hover {
  border: 1px solid transparent;
}
</style>
