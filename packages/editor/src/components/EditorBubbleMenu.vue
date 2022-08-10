<script lang="ts" setup>
import type { PropType } from "vue";
import { BubbleMenu, Editor } from "@tiptap/vue-3";
import type { MenuItem } from "@/types";
import MdiFormatBold from "~icons/mdi/format-bold";
import MdiFormatItalic from "~icons/mdi/format-italic";
import MdiFormatStrikethrough from "~icons/mdi/format-strikethrough";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const menuItems: MenuItem[] = [
  {
    type: "button",
    icon: MdiFormatBold,
    title: "Bold",
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive("bold"),
  },
  {
    type: "button",
    icon: MdiFormatItalic,
    title: "Italic",
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive("italic"),
  },
  {
    type: "button",
    icon: MdiFormatStrikethrough,
    title: "Strike",
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive("strike"),
  },
];
</script>
<template>
  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }">
    <div
      class="bg-white flex items-center rounded p-1 border drop-shadow space-x-0.5"
    >
      <button
        v-for="(menuItem, index) in menuItems"
        :key="index"
        :class="{ 'bg-gray-200 !text-black': menuItem.isActive() }"
        :title="menuItem.title"
        class="text-gray-600 text-lg hover:bg-gray-100 p-0.5 rounded-sm"
        @click="menuItem.action()"
      >
        <component :is="menuItem.icon" />
      </button>
    </div>
  </bubble-menu>
</template>