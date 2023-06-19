<script lang="ts" setup>
import type { Component } from "vue";
import { VTooltip } from "floating-vue";

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
  <button
    v-tooltip="title"
    :class="{ 'bg-gray-200': isActive }"
    class="hover:bg-gray-100 p-1 rounded-sm"
    @click="action"
  >
    <component :is="icon" />
  </button>
</template>
