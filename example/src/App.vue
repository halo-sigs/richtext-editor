<script lang="ts" setup>
import "@halo-dev/richtext-editor/dist/style.css";
import { computed, ref, watchEffect } from "vue";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
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
  ExtensionListItem,
  ExtensionOrderedList,
  ExtensionParagraph,
  ExtensionStrike,
  ExtensionText,
  ExtensionImage,
  ExtensionTaskList,
  ExtensionTaskItem,
  ExtensionLink,
  ExtensionTextAlign,
  ExtensionUnderline,
  ExtensionTable,
  ExtensionTableHeader,
  ExtensionTableCell,
  ExtensionTableRow,
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionPlaceholder,
  ExtensionCommands,
  CommandsSuggestion,
  CommandHeader1,
  CommandHeader2,
  CommandHeader3,
  CommandHeader4,
  CommandHeader5,
  CommandHeader6,
  CommandCodeBlock,
  ExtensionCodeBlock,
  lowlight,
  ExtensionKatexBlock,
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
    ExtensionListItem,
    ExtensionOrderedList,
    ExtensionParagraph,
    ExtensionStrike,
    ExtensionText,
    ExtensionImage.configure({
      inline: true,
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
    ExtensionSubscript,
    ExtensionSuperscript,
    ExtensionPlaceholder.configure({
      placeholder: "输入 / 以选择输入类型",
    }),
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
    ExtensionKatexBlock,
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
