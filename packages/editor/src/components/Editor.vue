<script lang="ts" setup>
import { EditorContent, useEditor } from "@tiptap/vue-3";
import EditorHeader from "./EditorHeader.vue";
import EditorBubbleMenu from "./EditorBubbleMenu.vue";
import StarterKit from "@tiptap/starter-kit";
import ExtensionImage from "@tiptap/extension-image";
import ExtensionTaskList from "@tiptap/extension-task-list";
import ExtensionTaskItem from "@tiptap/extension-task-item";
import ExtensionLink from "@tiptap/extension-link";
import ExtensionTextAlign from "@tiptap/extension-text-align";
import ExtensionUnderline from "@tiptap/extension-underline";
import ExtensionTable from "@tiptap/extension-table";
import ExtensionTableHeader from "@tiptap/extension-table-header";
import ExtensionTableCell from "@tiptap/extension-table-cell";
import ExtensionTableRow from "@tiptap/extension-table-row";
import ExtensionSubscript from "@tiptap/extension-subscript";
import ExtensionSuperscript from "@tiptap/extension-superscript";
import ExtensionPlaceholder from "@tiptap/extension-placeholder";
import { KatexBlock as ExtensionKatexBlock } from "../extensions/katex/index";
import { watch } from "vue";
import "github-markdown-css/github-markdown-light.css";
import {
  CommandsSuggestion,
  ExtensionCommands,
} from "../extensions/commands-menu";
import { ExtensionCodeBlock, lowlight } from "@/extensions/code-block";

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
    ExtensionTaskList,
    ExtensionTaskItem,
    ExtensionLink.configure({
      autolink: true,
      openOnClick: false,
    }),
    ExtensionTextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ExtensionUnderline,
    ExtensionTable.configure({
      resizable: true,
    }),
    ExtensionTableHeader,
    ExtensionTableCell,
    ExtensionTableRow,
    ExtensionSuperscript,
    ExtensionSubscript,
    ExtensionPlaceholder.configure({
      placeholder: "输入 / 以选择输入类型",
    }),
    ExtensionCommands.configure({
      suggestion: CommandsSuggestion,
    }),
    ExtensionCodeBlock.configure({
      lowlight,
    }),
    ExtensionKatexBlock,
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
