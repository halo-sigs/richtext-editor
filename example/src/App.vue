<script lang="ts" setup>
import "@halo-dev/richtext-editor/dist/style.css";
import { computed, ref, watchEffect, markRaw } from "vue";
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
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionPlaceholder,
  ExtensionHighlight,
  ExtensionCommands,
  ExtensionIframe,
  ExtensionVideo,
  ExtensionAudio,
  ExtensionKatex2Block,
  ExtensionKatex2Inline,
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
  TableMenuItem,
  BulletListMenuItem,
  OrderedListMenuItem,
  TaskListMenuItem,
  HighlightMenuItem,
  Separator,
  Editor,
  type Item,
} from "@halo-dev/richtext-editor";
import MdiImageOutline from "~icons/mdi/image-outline";
import {
  CommandKatex2Block,
  CommandKatex2Inline,
} from "./draft/ExtensionKatex2";

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
    ExtensionListItem,
    ExtensionOrderedList,
    ExtensionParagraph,
    ExtensionStrike,
    ExtensionText,
    ExtensionImage.configure({
      HTMLAttributes: {
        loading: "lazy",
      },
    }),
    ExtensionTaskList,
    ExtensionTaskItem,
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
    ExtensionKatex2Block,
    ExtensionKatex2Inline,
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
            CommandKatex2Block,
            CommandKatex2Inline,
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

const toolbarMenuItems = computed(() => {
  if (!editor.value) return [];
  return [
    UndoMenuItem(editor.value),
    RedoMenuItem(editor.value),
    Separator(),
    HeadingMenuItem(editor.value),
    BoldMenuItem(editor.value),
    ItalicMenuItem(editor.value),
    UnderlineMenuItem(editor.value),
    StrikeMenuItem(editor.value),
    HighlightMenuItem(editor.value),
    Separator(),
    QuoteMenuItem(editor.value),
    CodeMenuItem(editor.value),
    SuperScriptMenuItem(editor.value),
    SubScriptMenuItem(editor.value),
    Separator(),
    BulletListMenuItem(editor.value),
    OrderedListMenuItem(editor.value),
    TaskListMenuItem(editor.value),
    Separator(),
    CodeBlockMenuItem(editor.value),
    TableMenuItem(editor.value),
    Separator(),
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
    :toolbar-menu-items="toolbarMenuItems"
    :bubble-menu-items="bubbleMenuItems"
  />
</template>
<style lang="scss">
.ProseMirror {
  .katex-render {
    cursor: pointer;
    padding: 0 0.25rem;
    transition: background 0.2s;

    &:hover {
      background: #eee;
    }
  }
}
</style>