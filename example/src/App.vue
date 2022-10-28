<script lang="ts" setup>
import "@halo-dev/richtext-editor/dist/style.css";
import { computed, ref, watchEffect } from "vue";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import {
  allExtensions,
  RichTextEditor,
  useEditor,
  UndoMenuItem,
  RedoMenuItem,
  BoldMenuItem,
  ItalicMenuItem,
  UnderlineMenuItem,
  StrikeMenuItem,
  QuoteMenuItem,
  CodeMenuItem,
  SuperScriptMenuItem,
  SubScriptMenuItem,
  CodeBlockMenuItem,
  HeadingMenuItem,
  AlignLeftMenuItem,
  AlignCenterMenuItem,
  AlignRightMenuItem,
  AlignJustifyMenuItem,
} from "@halo-dev/richtext-editor";

const content = ref("");

const editor = useEditor({
  content: content.value,
  extensions: [...allExtensions],
  onUpdate: () => {
    content.value = editor.value?.getHTML() + "";
  },
});

const formatContent = computed(() => {
  return unified()
    .use(rehypeParse)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .processSync(content.value);
});

watchEffect(() => {
  console.log(String(formatContent.value));
});

const toolbarMenuItems = computed(() => {
  if (!editor.value) return [];
  return [
    UndoMenuItem(editor.value),
    RedoMenuItem(editor.value),
    BoldMenuItem(editor.value),
    ItalicMenuItem(editor.value),
    UnderlineMenuItem(editor.value),
    StrikeMenuItem(editor.value),
    QuoteMenuItem(editor.value),
    CodeMenuItem(editor.value),
    SuperScriptMenuItem(editor.value),
    SubScriptMenuItem(editor.value),
    CodeBlockMenuItem(editor.value),
    HeadingMenuItem(editor.value),
    AlignLeftMenuItem(editor.value),
    AlignCenterMenuItem(editor.value),
    AlignRightMenuItem(editor.value),
    AlignJustifyMenuItem(editor.value),
  ];
});

const bubbleMenuItems = computed(() => {
  if (!editor.value) return [];
  return [
    BoldMenuItem(editor.value),
    ItalicMenuItem(editor.value),
    UnderlineMenuItem(editor.value),
    StrikeMenuItem(editor.value),
    QuoteMenuItem(editor.value),
    CodeMenuItem(editor.value),
    CodeBlockMenuItem(editor.value),
    SuperScriptMenuItem(editor.value),
    SubScriptMenuItem(editor.value),
    AlignLeftMenuItem(editor.value),
    AlignCenterMenuItem(editor.value),
    AlignRightMenuItem(editor.value),
    AlignJustifyMenuItem(editor.value),
  ];
});
</script>

<template>
  <RichTextEditor
    v-if="editor"
    :editor="editor"
    :toolbar-menu-items="toolbarMenuItems"
    :bubble-menu-items="bubbleMenuItems"
  />
</template>
