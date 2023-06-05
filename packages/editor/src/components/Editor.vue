<script lang="ts" setup>
import { Editor, EditorContent } from "@tiptap/vue-3";
import EditorHeader from "./EditorHeader.vue";
import EditorBubbleMenu from "./EditorBubbleMenu.vue";
import { watch, type CSSProperties, type PropType } from "vue";
import type { MenuItem } from "@/types";
import { i18n } from "@/locales";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  additionalMenuItems: {
    type: Array as PropType<MenuItem[]>,
    required: false,
    default: () => [],
  },
  toolbarMenuItems: {
    type: Array as PropType<MenuItem[]>,
    required: false,
    default: () => [],
  },
  bubbleMenuItems: {
    type: Array as PropType<MenuItem[]>,
    required: false,
    default: () => [],
  },
  contentStyles: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => ({}),
  },
  locale: {
    type: String as PropType<"zh-CN" | "en" | "zh" | "en-US">,
    required: false,
    default: "zh-CN",
  },
});

watch(
  () => props.locale,
  () => {
    i18n.global.locale.value = props.locale;
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div v-if="editor" class="halo-rich-text-editor">
    <editor-bubble-menu :editor="editor" :menu-items="bubbleMenuItems" />
    <editor-header :menu-items="toolbarMenuItems" />
    <div class="h-full flex flex-row w-full">
      <editor-content
        :editor="editor"
        :style="contentStyles"
        class="editor-content markdown-body"
      />
      <div class="h-full">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>
