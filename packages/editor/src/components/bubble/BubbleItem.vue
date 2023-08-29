<script lang="ts" setup>
import type { Component } from "vue";
import { VTooltip } from "floating-vue";

withDefaults(
  defineProps<{
    isActive?: boolean;
    visible?: boolean;
    title?: string;
    action?: () => void;
    icon?: Component;
  }>(),
  {
    isActive: false,
    visible: true,
    title: undefined,
    action: undefined,
    icon: undefined,
  }
);
</script>

<template>
  <button
    v-if="visible"
    v-tooltip="{
      content: title,
      distance: 8,
      delay: {
        show: 0,
      },
    }"
    :class="{ 'bg-gray-200 !text-black': isActive }"
    :title="title"
    class="text-gray-600 text-lg hover:bg-gray-100 p-2 rounded-sm"
    @click="action?.()"
  >
    <component :is="icon" class="w-5 h-5" />
  </button>
</template>
<style>
.v-popper__popper.v-popper__popper--show-from .v-popper__wrapper {
  transform: scale(0.9);
}

.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  transform: none;
  transition: transform 0.1s;
}
</style>
