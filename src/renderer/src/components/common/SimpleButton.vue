<script setup lang="ts"></script>

<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f0f0f0;
  cursor: pointer;
  transition-property: border-color;
  transition-duration: 0.25s;
}

.button:hover {
  border-color: #647eff;
}
</style>
