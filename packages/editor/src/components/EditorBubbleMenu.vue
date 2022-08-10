<script lang="ts" setup>
import type { PropType } from "vue";
import { BubbleMenu, Editor } from "@tiptap/vue-3";
import type { MenuItem } from "@/types";
import MdiFormatBold from "~icons/mdi/format-bold";
import MdiFormatItalic from "~icons/mdi/format-italic";
import MdiFormatStrikethrough from "~icons/mdi/format-strikethrough";
import MdiFormatUnderline from "~icons/mdi/format-underline";
import MdiFormatAlignLeft from "~icons/mdi/format-align-left";
import MdiFormatAlignCenter from "~icons/mdi/format-align-center";
import MdiFormatAlignRight from "~icons/mdi/format-align-right";
import MdiFormatAlignJustify from "~icons/mdi/format-align-justify";

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
    icon: MdiFormatUnderline,
    title: "Underline",
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive("underline"),
  },
  {
    type: "button",
    icon: MdiFormatStrikethrough,
    title: "Strike",
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive("strike"),
  },
  {
    type: "button",
    icon: MdiFormatAlignLeft,
    title: "Align left",
    action: () => props.editor.chain().focus().setTextAlign("left").run(),
    isActive: () => props.editor.isActive({ textAlign: "left" }),
  },
  {
    type: "button",
    icon: MdiFormatAlignCenter,
    title: "Align center",
    action: () => props.editor.chain().focus().setTextAlign("center").run(),
    isActive: () => props.editor.isActive({ textAlign: "center" }),
  },
  {
    type: "button",
    icon: MdiFormatAlignRight,
    title: "Align right",
    action: () => props.editor.chain().focus().setTextAlign("right").run(),
    isActive: () => props.editor.isActive({ textAlign: "right" }),
  },
  {
    type: "button",
    icon: MdiFormatAlignJustify,
    title: "Align justify",
    action: () => props.editor.chain().focus().setTextAlign("justify").run(),
    isActive: () => props.editor.isActive({ textAlign: "justify" }),
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
