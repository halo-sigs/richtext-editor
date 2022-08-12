<script lang="ts" setup>
import type { PropType } from "vue";
import { Editor } from "@tiptap/vue-3";
import { Menu as VMenu } from "floating-vue";
import type { MenuItem } from "@/types";
import MdiFormatBold from "~icons/mdi/format-bold";
import MdiFormatItalic from "~icons/mdi/format-italic";
import MdiFormatStrikethrough from "~icons/mdi/format-strikethrough";
import MdiFormatHeaderPound from "~icons/mdi/format-header-pound";
import MdiFormatHeader1 from "~icons/mdi/format-header-1";
import MdiFormatHeader2 from "~icons/mdi/format-header-2";
import MdiFormatHeader3 from "~icons/mdi/format-header-3";
import MdiFormatHeader4 from "~icons/mdi/format-header-4";
import MdiFormatHeader5 from "~icons/mdi/format-header-5";
import MdiFormatHeader6 from "~icons/mdi/format-header-6";
import MdiUndoVariant from "~icons/mdi/undo-variant";
import MdiRedoVariant from "~icons/mdi/redo-variant";
import MdiFormatUnderline from "~icons/mdi/format-underline";
import MdiFormatAlignLeft from "~icons/mdi/format-align-left";
import MdiFormatAlignCenter from "~icons/mdi/format-align-center";
import MdiFormatAlignRight from "~icons/mdi/format-align-right";
import MdiFormatAlignJustify from "~icons/mdi/format-align-justify";
import MdiFormatQuoteOpen from "~icons/mdi/format-quote-open";
import MdiCodeTags from "~icons/mdi/code-tags";
import MdiCodeBracesBox from "~icons/mdi/code-braces-box";
import MdiMathCompass from "~icons/mdi/math-compass";
import MdiFormatSuperscript from "~icons/mdi/format-superscript";
import MdiFormatSubscript from "~icons/mdi/format-subscript";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const menuItems: MenuItem[] = [
  {
    type: "button",
    icon: MdiUndoVariant,
    title: "Undo",
    action: () => props.editor.chain().undo().run(),
    isActive: () => false,
  },
  {
    type: "button",
    icon: MdiRedoVariant,
    title: "Redo",
    action: () => props.editor.chain().redo().run(),
    isActive: () => false,
  },

  {
    type: "button",
    icon: MdiFormatBold,
    title: "Bold",
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive("bold"),
  },
  {
    type: "button",
    icon: MdiFormatItalic,
    title: "Italic",
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive("italic"),
  },
  {
    type: "button",
    icon: MdiFormatUnderline,
    title: "Underline",
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive("underline"),
  },
  {
    type: "button",
    icon: MdiFormatStrikethrough,
    title: "Strike",
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive("strike"),
  },
  {
    type: "button",
    icon: MdiFormatQuoteOpen,
    title: "Quote",
    action: () => props.editor.chain().focus().toggleBlockquote().run(),
    isActive: () => props.editor.isActive("blockquote"),
  },
  {
    type: "button",
    icon: MdiCodeTags,
    title: "Code",
    action: () => props.editor.chain().focus().toggleCode().run(),
    isActive: () => props.editor.isActive("code"),
  },
  {
    type: "button",
    icon: MdiFormatSuperscript,
    title: "SuperScript",
    action: () => props.editor.chain().focus().toggleSuperscript().run(),
    isActive: () => props.editor.isActive("superscript"),
  },
  {
    type: "button",
    icon: MdiFormatSubscript,
    title: "SubScript",
    action: () => props.editor.chain().focus().toggleSubscript().run(),
    isActive: () => props.editor.isActive("subscript"),
  },
  {
    type: "button",
    icon: MdiCodeBracesBox,
    title: "Code Block",
    action: () => props.editor.chain().focus().toggleCodeBlock().run(),
    isActive: () => props.editor.isActive("codeBlock"),
  },
  {
    type: "button",
    icon: MdiMathCompass,
    title: "Math",
    action: () => props.editor.chain().addKatex().run(),
    isActive: () => props.editor.isActive("katexBlock"),
  },
  {
    type: "button",
    icon: MdiFormatHeaderPound,
    title: "普通文本",
    isActive: () => props.editor.isActive("heading"),
    children: [
      {
        type: "button",
        icon: MdiFormatHeader1,
        title: "标题 1",
        action: () =>
          props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => props.editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader2,
        title: "标题 2",
        action: () =>
          props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => props.editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader3,
        title: "标题 3",
        action: () =>
          props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => props.editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader4,
        title: "标题 4",
        action: () =>
          props.editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => props.editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader5,
        title: "标题 5",
        action: () =>
          props.editor.chain().focus().toggleHeading({ level: 5 }).run(),
        isActive: () => props.editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader6,
        title: "标题 6",
        action: () =>
          props.editor.chain().focus().toggleHeading({ level: 6 }).run(),
        isActive: () => props.editor.isActive("heading", { level: 1 }),
      },
    ],
  },
  {
    type: "button",
    icon: MdiFormatAlignLeft,
    title: "Align left",
    action: () => props.editor.chain().focus().setTextAlign("left").run(),
    isActive: () => props.editor.isActive({ textAlign: "left" }),
  },
  {
    type: "button",
    icon: MdiFormatAlignCenter,
    title: "Align center",
    action: () => props.editor.chain().focus().setTextAlign("center").run(),
    isActive: () => props.editor.isActive({ textAlign: "center" }),
  },
  {
    type: "button",
    icon: MdiFormatAlignRight,
    title: "Align right",
    action: () => props.editor.chain().focus().setTextAlign("right").run(),
    isActive: () => props.editor.isActive({ textAlign: "right" }),
  },
  {
    type: "button",
    icon: MdiFormatAlignJustify,
    title: "Align justify",
    action: () => props.editor.chain().focus().setTextAlign("justify").run(),
    isActive: () => props.editor.isActive({ textAlign: "justify" }),
  },
];
</script>
<template>
  <div
    class="editor-header flex items-center py-1 space-x-0.5 justify-center border-b drop-shadow-sm"
  >
    <div
      v-for="(menuItem, index) in menuItems"
      :key="index"
      class="inline-flex items-center justify-center"
    >
      <button
        v-if="!menuItem.children?.length"
        :class="{ 'bg-gray-200': menuItem.isActive() }"
        class="hover:bg-gray-100 p-1 rounded-sm"
        @click="menuItem.action"
      >
        <component :is="menuItem.icon" />
      </button>
      <VMenu v-else>
        <button
          :class="{ 'bg-gray-200': menuItem.isActive() }"
          class="hover:bg-gray-100 p-1 rounded-sm"
        >
          <component :is="menuItem.icon" />
        </button>
        <template #popper>
          <div class="w-24 flex flex-col">
            <div
              v-for="(child, childIndex) in menuItem.children"
              :key="childIndex"
              :class="{ 'bg-gray-200': child.isActive() }"
              class="p-1 hover:bg-gray-100"
            >
              <button
                class="flex flex-row gap-2 items-center justify-center"
                @click="child.action"
              >
                <component :is="child.icon" />
                <span class="text-sm">
                  {{ child.title }}
                </span>
              </button>
            </div>
          </div>
        </template>
      </VMenu>
    </div>
  </div>
</template>
