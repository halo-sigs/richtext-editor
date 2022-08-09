<script lang="ts" setup>
import { EditorContent, useEditor } from "@tiptap/vue-3";
import EditorHeader from "./EditorHeader.vue";
import StarterKit from "@tiptap/starter-kit";
import ExtensionImage from "@tiptap/extension-image";
import { watch } from "vue";
import "github-markdown-css/github-markdown-light.css";
import { ExtensionCommands, CommandsSuggestion } from "../extensions/commands";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    ExtensionImage.configure({
      HTMLAttributes: {
        loading: "lazy",
      },
    }),
    ExtensionCommands.configure({
      suggestion: CommandsSuggestion,
    }),
  ],
  onUpdate: () => {
    emit("update:modelValue", editor.value?.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = editor.value?.getHTML() === newValue;

    if (isSame) {
      return;
    }

    editor.value?.commands.setContent(newValue, false);
  }
);
</script>
<template>
  <editor-header v-if="editor" :editor="editor" />
  <editor-content v-if="editor" :editor="editor" class="markdown-body" />
</template>
