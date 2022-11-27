<script lang="ts" setup>
import type { PropType } from "vue";
import { Menu as VMenu, VTooltip } from "floating-vue";
import type { MenuItem } from "@/types";
defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: false,
    default: () => [],
  },
});
</script>
<template>
  <div
    class="editor-header flex items-center py-1 space-x-0.5 justify-center border-b drop-shadow-sm bg-white"
  >
    <div
      v-for="(menuItem, index) in menuItems"
      :key="index"
      class="inline-flex items-center justify-center"
    >
      <template v-if="menuItem.type === 'separator'">
        <div class="px-1">
          <div class="h-5 bg-gray-100" style="width: 1px"></div>
        </div>
      </template>

      <template v-else>
        <button
          v-if="!menuItem.children?.length"
          v-tooltip="menuItem.title"
          :class="{ 'bg-gray-200': menuItem.isActive?.() }"
          class="hover:bg-gray-100 p-1 rounded-sm"
          @click="menuItem.action"
        >
          <component :is="menuItem.icon" />
        </button>
        <VMenu v-else class="inline-flex">
          <button
            :class="{ 'bg-gray-200': menuItem.isActive?.() }"
            class="hover:bg-gray-100 p-1 rounded-sm"
          >
            <component :is="menuItem.icon" />
          </button>
          <template #popper>
            <div
              class="relative rounded-md bg-white overflow-hidden drop-shadow w-48 p-1 max-h-72 overflow-y-auto"
            >
              <div
                v-for="(child, childIndex) in menuItem.children"
                :key="childIndex"
                :class="{ '!bg-gray-100': child.isActive?.() }"
                class="flex flex-row items-center rounded gap-4 p-1 hover:bg-gray-100 group cursor-pointer"
                @click="child.action"
              >
                <component
                  :is="child.icon"
                  class="bg-gray-100 p-1 rounded w-6 h-6 group-hover:bg-white"
                  :class="{ '!bg-white': child.isActive?.() }"
                />
                <span
                  class="text-xs text-gray-600 group-hover:text-gray-900 group-hover:font-medium"
                  :class="{ '!text-gray-900 !font-medium': child.isActive?.() }"
                >
                  {{ child.title }}
                </span>
              </div>
            </div>
          </template>
        </VMenu>
      </template>
    </div>
  </div>
</template>
