<script lang="ts" setup>
import type { Component } from "vue";

withDefaults(
  defineProps<{
    isActive?: boolean;
    title?: string;
    action?: () => void;
    icon?: Component;
  }>(),
  {
    isActive: false,
    title: undefined,
    action: undefined,
    icon: undefined,
  }
);
</script>

<template>
  <div
    :class="{ '!bg-gray-100': isActive }"
    class="flex flex-row items-center rounded gap-4 p-1 hover:bg-gray-100 group cursor-pointer"
    @click="action"
  >
    <component
      :is="icon"
      class="bg-gray-100 p-1 rounded w-6 h-6 group-hover:bg-white"
      :class="{ '!bg-white': isActive }"
    />
    <span
      class="text-xs text-gray-600 group-hover:text-gray-900 group-hover:font-medium"
      :class="{ '!text-gray-900 !font-medium': isActive }"
    >
      {{ title }}
    </span>
  </div>
</template>
