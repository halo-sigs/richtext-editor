<script lang="ts" setup>
import { Editor, EditorContent } from "@tiptap/vue-3";
import EditorHeader from "./EditorHeader.vue";
import EditorBubbleMenu from "./EditorBubbleMenu.vue";
import { PropType } from "vue";

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});
</script>
<template>
  <div v-if="editor" class="halo-rich-text-editor">
    <editor-bubble-menu :editor="editor" />
    <editor-header :editor="editor" />
    <div class="h-full flex flex-row w-full">
      <editor-content :editor="editor" class="editor-content markdown-body" />
      <div class="h-full">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>
