<script lang="ts" setup>
import {
  ExtensionAudio,
  ExtensionBlockquote,
  ExtensionBold,
  ExtensionBulletList,
  ExtensionCode,
  ExtensionCodeBlock,
  ExtensionColor,
  ExtensionCommands,
  ExtensionDocument,
  ExtensionDropcursor,
  ExtensionFontSize,
  ExtensionGapcursor,
  ExtensionHardBreak,
  ExtensionHeading,
  ExtensionHighlight,
  ExtensionHistory,
  ExtensionHorizontalRule,
  ExtensionIframe,
  ExtensionImage,
  ExtensionItalic,
  ExtensionLink,
  ExtensionOrderedList,
  ExtensionPlaceholder,
  ExtensionStrike,
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionTable,
  ExtensionTaskList,
  ExtensionText,
  ExtensionTextAlign,
  ExtensionUnderline,
  ExtensionVideo,
  RichTextEditor,
  lowlight,
  useEditor,
} from "@halo-dev/richtext-editor";
import "@halo-dev/richtext-editor/dist/style.css";
import { useLocalStorage } from "@vueuse/core";
import rehypeFormat from "rehype-format";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { computed, watchEffect } from "vue";

const content = useLocalStorage("content", "");

const editor = useEditor({
  content: content.value,
  extensions: [
    ExtensionBlockquote,
    ExtensionBold,
    ExtensionBulletList,
    ExtensionCode,
    ExtensionDocument,
    ExtensionDropcursor,
    ExtensionGapcursor,
    ExtensionHardBreak,
    ExtensionHeading,
    ExtensionHistory,
    ExtensionHorizontalRule,
    ExtensionItalic,
    ExtensionOrderedList,
    ExtensionStrike,
    ExtensionText,
    ExtensionImage.configure({
      HTMLAttributes: {
        loading: "lazy",
      },
    }),
    ExtensionTaskList,
    ExtensionLink.configure({
      autolink: false,
      openOnClick: false,
    }),
    ExtensionTextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ExtensionUnderline,
    ExtensionTable.configure({
      resizable: true,
    }),
    ExtensionSubscript,
    ExtensionSuperscript,
    ExtensionPlaceholder.configure({
      placeholder: "输入 / 以选择输入类型",
    }),
    ExtensionHighlight,
    ExtensionVideo,
    ExtensionAudio,
    ExtensionCommands,
    ExtensionCodeBlock.configure({
      lowlight,
    }),
    ExtensionIframe,
    ExtensionColor,
    ExtensionFontSize,
  ],
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
  // console.log(String(formatContent.value));
});

const locales = [
  {
    code: "zh-CN",
    label: "中文",
  },
  {
    code: "en-US",
    label: "English",
  },
];

const locale = useLocalStorage("locale", "zh-CN");
</script>

<template>
  <div>
    <select v-model="locale">
      <option v-for="(item, index) in locales" :key="index" :value="item.code">
        {{ item.label }}
      </option>
    </select>
  </div>

  <RichTextEditor v-if="editor" :editor="editor" :locale="locale" />
</template>
