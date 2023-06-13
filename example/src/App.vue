<script lang="ts" setup>
import "@halo-dev/richtext-editor/dist/style.css";
import { computed, watchEffect, markRaw } from "vue";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import { useLocalStorage } from "@vueuse/core";
import {
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
  ExtensionImage,
  ExtensionTaskList,
  ExtensionLink,
  ExtensionTextAlign,
  ExtensionUnderline,
  ExtensionTable,
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionPlaceholder,
  ExtensionHighlight,
  ExtensionCommands,
  ExtensionIframe,
  ExtensionVideo,
  ExtensionAudio,
  CommandsSuggestion,
  CommandHeader1,
  CommandHeader2,
  CommandHeader3,
  CommandHeader4,
  CommandHeader5,
  CommandHeader6,
  CommandCodeBlock,
  CommandIframe,
  CommandVideo,
  CommandAudio,
  CommandTable,
  CommandBulletList,
  CommandOrderedList,
  CommandTaskList,
  ExtensionCodeBlock,
  lowlight,
  RichTextEditor,
  useEditor,
  BoldMenuItem,
  ItalicMenuItem,
  UnderlineMenuItem,
  StrikeMenuItem,
  QuoteMenuItem,
  CodeMenuItem,
  SuperScriptMenuItem,
  SubScriptMenuItem,
  CodeBlockMenuItem,
  AlignLeftMenuItem,
  AlignCenterMenuItem,
  AlignRightMenuItem,
  AlignJustifyMenuItem,
  HighlightMenuItem,
  Editor,
  type Item,
} from "@halo-dev/richtext-editor";
import MdiImageOutline from "~icons/mdi/image-outline";

const content = useLocalStorage("content", "");

const CommandImage: Item = {
  icon: markRaw(MdiImageOutline),
  title: "editor.extensions.commands_menu.image",
  keywords: ["image", "tupian"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    const url = window.prompt("请输入图片地址", "");
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        { type: "image", attrs: { src: url } },
        { type: "paragraph", content: "" },
      ])
      .run();
  },
};

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
    ExtensionCommands.configure({
      suggestion: {
        ...CommandsSuggestion,
        items: ({ query }: { query: string }) => {
          return [
            CommandHeader1,
            CommandHeader2,
            CommandHeader3,
            CommandHeader4,
            CommandHeader5,
            CommandHeader6,
            CommandCodeBlock,
            CommandTable,
            CommandBulletList,
            CommandOrderedList,
            CommandTaskList,
            CommandIframe,
            CommandImage,
            CommandVideo,
            CommandAudio,
          ].filter((item) =>
            [...item.keywords, item.title].some((keyword) =>
              keyword.includes(query)
            )
          );
        },
      },
    }),
    ExtensionCodeBlock.configure({
      lowlight,
    }),
    ExtensionIframe,
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
  console.log(String(formatContent.value));
});

const bubbleMenuItems = computed(() => {
  if (!editor.value) return [];
  return [
    BoldMenuItem(editor.value),
    ItalicMenuItem(editor.value),
    UnderlineMenuItem(editor.value),
    StrikeMenuItem(editor.value),
    HighlightMenuItem(editor.value),
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

  <RichTextEditor
    v-if="editor"
    :editor="editor"
    :locale="locale"
    :bubble-menu-items="bubbleMenuItems"
  />
</template>
