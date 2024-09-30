<script setup lang="ts">
import SimpleButton from '@renderer/components/common/SimpleButton.vue'

const fetchTest = () => {
  window.api.scrapeTest()
}
</script>

<template>
  <div class="wrapper">
    <SimpleButton>Fetch</SimpleButton>
    <SimpleButton @click="fetchTest">Fetch(Test)</SimpleButton>
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
</style>
