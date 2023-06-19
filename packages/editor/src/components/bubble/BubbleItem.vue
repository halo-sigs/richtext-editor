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
    v-tooltip="title"
    :class="{ 'bg-gray-200 !text-black': isActive }"
    :title="title"
    class="text-gray-600 text-lg hover:bg-gray-100 p-0.5 rounded-sm"
    @click="action?.()"
  >
    <component :is="icon" />
  </button>
</template>
