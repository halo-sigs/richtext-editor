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
</script>

<template>
  <RichTextEditor v-if="editor" :editor="editor" />
</template>
