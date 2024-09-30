<script setup lang="ts">
const days = ['月', '火', '水', '木', '金']
const periods = ['1-2限', '3-4限', '5-6限', '7-8限', '9-10限']
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="period in periods" :key="period">
        <td>{{ period }}</td>
        <td v-for="day in days" :key="day"></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  margin-top: 1rem;
  width: 100%;
  height: 80%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
</style>
