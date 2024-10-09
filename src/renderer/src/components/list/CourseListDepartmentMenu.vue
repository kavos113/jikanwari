<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  items: object
}>()

const emits = defineEmits<{
  (event: 'decideValue', value: string): void
}>()

const openItems = ref({})

const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value)
}

const isArray = (value) => {
  return Array.isArray(value)
}

const openSubMenu = (key) => {
  openItems.value[key] = true
}

const closeSubMenu = (key) => {
  openItems.value[key] = false
}

const isOpen = (key) => {
  return openItems.value[key]
}

const clickItem = (key) => {
  if (key === '選択解除') {
    emits('decideValue', '')
    return
  }
  emits('decideValue', key)
}

const clickSubItem = (key) => {
  emits('decideValue', key)
}
</script>

<template>
  <ul class="menu">
    <li
      v-for="(item, key) in props.items"
      :key="key"
      class="menuItem"
      @mouseenter="openSubMenu(key)"
      @mouseleave="closeSubMenu(key)"
      @click="clickItem(key)"
    >
      <div class="menuLabel">
        {{ key }}
        <span v-if="isObject(item) || isArray(item)" class="arrow">▶</span>
      </div>
      <template v-if="isOpen(key)">
        <CourseListDepartmentMenu
          v-if="isObject(item)"
          :items="item"
          class="submenu"
          @mouseenter="openSubMenu(key)"
          @mouseleave="closeSubMenu(key)"
          @decide-value="clickSubItem"
        />
        <ul
          v-else-if="isArray(item)"
          class="submenu"
          @mouseenter="openSubMenu(key)"
          @mouseleave="closeSubMenu(key)"
        >
          <li v-for="subItem in item" :key="subItem" class="subItem" @click="clickItem(subItem)">
            {{ subItem }}
          </li>
        </ul>
      </template>
    </li>
  </ul>
</template>

<style scoped>
.menu {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px var(--color-main);
}

.menuItem {
  position: relative;
  border-bottom: 1px solid #ddd;
  padding: 0.5em 1em;
  cursor: pointer;
}

.menuItem:hover {
  background-color: #f0f0f0;
}

.menuItem:last-child {
  border-bottom: none;
}

.subItem {
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  padding: 0.5em 1em;
}

.subItem:hover {
  background-color: #f0f0f0;
}

.subItem:last-child {
  border-bottom: none;
}

.menuLabel {
  display: flex;
  align-items: center;
  user-select: none;
}

.submenu {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 100%;
  width: 17em;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px var(--color-main);
}

.arrow {
  margin-left: auto;
}
</style>
