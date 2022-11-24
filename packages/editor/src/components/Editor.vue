<script lang="ts" setup>
import { Editor, EditorContent } from "@tiptap/vue-3";
import EditorHeader from "./EditorHeader.vue";
import EditorBubbleMenu from "./EditorBubbleMenu.vue";
import type { PropType } from "vue";
import type { MenuItem } from "@/types";

defineProps({
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
});
</script>
<template>
  <div v-if="editor" class="halo-rich-text-editor">
    <editor-bubble-menu :editor="editor" :menu-items="bubbleMenuItems" />
    <editor-header :menu-items="toolbarMenuItems" />
    <div class="h-full flex flex-row w-full">
      <editor-content
        :editor="editor"
        class="editor-content prose prose-base !max-w-none prose-pre:p-0 bg-white prose-p:mt-3 prose-p:mb-3"
      />
      <div class="h-full">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>
