<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  items: object
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
</script>

<template>
  <ul class="menu">
    <li v-for="(item, key) in props.items" :key="key" class="menuItem">
      <div class="menuLabel" @mouseenter="openSubMenu(key)" @mouseleave="closeSubMenu(key)">
        {{ key }}
        <span v-if="isObject(item) || isArray(item)">▼</span>
      </div>
      <template v-if="isOpen(key)">
        <CourseListDepartmentMenu
          v-if="isObject(item)"
          :items="item"
          class="submenu"
          @mouseenter="openSubMenu(key)"
          @mouseleave="closeSubMenu(key)"
        />
        <ul
          v-else-if="isArray(item)"
          class="submenu"
          @mouseenter="openSubMenu(key)"
          @mouseleave="closeSubMenu(key)"
        >
          <li v-for="subItem in item" :key="subItem">
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
}

.menuItem {
  position: relative;
}

.menuLabel {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.menuLabel:hover {
  background-color: #f0f0f0;
}

.submenu {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 100%;
  width: 15em;
  background-color: #fff;
}
</style>
