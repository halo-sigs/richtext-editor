import type { Editor, Range } from "@tiptap/core";
import TiptapParagraph from "@tiptap/extension-paragraph";
import TiptapHeading from "@tiptap/extension-heading";
import type { HeadingOptions } from "@tiptap/extension-heading";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import ToolbarButtonItem from "@/components/toolbar/ToolbarButtonItem.vue";
import MdiFormatParagraph from "~icons/mdi/format-paragraph";
import MdiFormatHeaderPound from "~icons/mdi/format-header-pound";
import MdiFormatHeader1 from "~icons/mdi/format-header-1";
import MdiFormatHeader2 from "~icons/mdi/format-header-2";
import MdiFormatHeader3 from "~icons/mdi/format-header-3";
import MdiFormatHeader4 from "~icons/mdi/format-header-4";
import MdiFormatHeader5 from "~icons/mdi/format-header-5";
import MdiFormatHeader6 from "~icons/mdi/format-header-6";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const Blockquote = TiptapHeading.extend<ExtensionOptions & HeadingOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 30,
          component: ToolbarButton,
          props: {
            isActive:
              editor.isActive("paragraph") || editor.isActive("heading"),
            icon: markRaw(MdiFormatHeaderPound),
          },
          children: [
            {
              priority: 10,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("paragraph"),
                icon: markRaw(MdiFormatParagraph),
                title: i18n.global.t("editor.common.heading.paragraph"),
                action: () => editor.chain().focus().setParagraph().run(),
              },
            },
            {
              priority: 20,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("heading", { level: 1 }),
                icon: markRaw(MdiFormatHeader1),
                title: i18n.global.t("editor.common.heading.header1"),
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run(),
              },
            },
            {
              priority: 30,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("heading", { level: 2 }),
                icon: markRaw(MdiFormatHeader2),
                title: i18n.global.t("editor.common.heading.header2"),
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run(),
              },
            },
            {
              priority: 40,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("heading", { level: 3 }),
                icon: markRaw(MdiFormatHeader3),
                title: i18n.global.t("editor.common.heading.header3"),
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run(),
              },
            },
            {
              priority: 50,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("heading", { level: 4 }),
                icon: markRaw(MdiFormatHeader4),
                title: i18n.global.t("editor.common.heading.header4"),
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run(),
              },
            },
            {
              priority: 60,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("heading", { level: 5 }),
                icon: markRaw(MdiFormatHeader5),
                title: i18n.global.t("editor.common.heading.header5"),
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run(),
              },
            },
            {
              priority: 70,
              component: ToolbarButtonItem,
              props: {
                isActive: editor.isActive("heading", { level: 6 }),
                icon: markRaw(MdiFormatHeader6),
                title: i18n.global.t("editor.common.heading.header6"),
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 6 }).run(),
              },
            },
          ],
        };
      },
      getCommandMenuItems() {
        return [
          {
            priority: 10,
            icon: markRaw(MdiFormatParagraph),
            title: "editor.common.heading.paragraph",
            keywords: ["paragraph", "text", "putongwenben"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor.chain().focus().deleteRange(range).setParagraph().run();
            },
          },
          {
            priority: 20,
            icon: markRaw(MdiFormatHeader1),
            title: "editor.common.heading.header1",
            keywords: ["h1", "header1", "1", "yijibiaoti"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
            },
          },
          {
            priority: 30,
            icon: markRaw(MdiFormatHeader2),
            title: "editor.common.heading.header2",
            keywords: ["h2", "header2", "2", "erjibiaoti"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
            },
          },
          {
            priority: 40,
            icon: markRaw(MdiFormatHeader3),
            title: "editor.common.heading.header3",
            keywords: ["h3", "header3", "3", "sanjibiaoti"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
            },
          },
          {
            priority: 50,
            icon: markRaw(MdiFormatHeader4),
            title: "editor.common.heading.header4",
            keywords: ["h4", "header4", "4", "sijibiaoti"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 4 })
                .run();
            },
          },
          {
            priority: 60,
            icon: markRaw(MdiFormatHeader5),
            title: "editor.common.heading.header5",
            keywords: ["h5", "header5", "5", "wujibiaoti"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 5 })
                .run();
            },
          },
          {
            priority: 70,
            icon: markRaw(MdiFormatHeader6),
            title: "editor.common.heading.header6",
            keywords: ["h6", "header6", "6", "liujibiaoti"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 6 })
                .run();
            },
          },
        ];
      },
    };
  },
  addExtensions() {
    return [TiptapParagraph];
  },
});

export default Blockquote;
