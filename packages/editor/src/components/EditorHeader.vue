<script lang="ts" setup>
import type { PropType } from "vue";
import { Menu as VMenu } from "floating-vue";
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
      <button
        v-if="!menuItem.children?.length"
        :class="{ 'bg-gray-200': menuItem.isActive?.() }"
        class="hover:bg-gray-100 p-1 rounded-sm"
        @click="menuItem.action"
      >
        <component :is="menuItem.icon" />
      </button>
      <VMenu v-else>
        <button
          :class="{ 'bg-gray-200': menuItem.isActive?.() }"
          class="hover:bg-gray-100 p-1 rounded-sm"
        >
          <component :is="menuItem.icon" />
        </button>
        <template #popper>
          <div class="w-24 flex flex-col">
            <div
              v-for="(child, childIndex) in menuItem.children"
              :key="childIndex"
              :class="{ 'bg-gray-200': child.isActive?.() }"
              class="p-1 hover:bg-gray-100"
            >
              <button
                class="flex flex-row gap-2 items-center justify-center"
                @click="child.action"
              >
                <component :is="child.icon" />
                <span class="text-sm">
                  {{ child.title }}
                </span>
              </button>
            </div>
          </div>
        </template>
      </VMenu>
    </div>
  </div>
</template>
