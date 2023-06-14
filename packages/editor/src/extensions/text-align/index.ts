import type { Editor } from "@tiptap/core";
import TiptapTextAlign from "@tiptap/extension-text-align";
import type { TextAlignOptions } from "@tiptap/extension-text-align";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatAlignLeft from "~icons/mdi/format-align-left";
import MdiFormatAlignCenter from "~icons/mdi/format-align-center";
import MdiFormatAlignRight from "~icons/mdi/format-align-right";
import MdiFormatAlignJustify from "~icons/mdi/format-align-justify";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import BubbleButton from "@/components/bubble/BubbleButton.vue";

const TextAlign = TiptapTextAlign.extend<ExtensionOptions & TextAlignOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 180,
            component: ToolbarButton,
            props: {
              isActive: editor.isActive({ textAlign: "left" }),
              icon: markRaw(MdiFormatAlignLeft),
              title: i18n.global.t("editor.common.align_left"),
              action: () => editor.chain().focus().setTextAlign("left").run(),
            },
          },
          {
            priority: 190,
            component: ToolbarButton,
            props: {
              isActive: editor.isActive({ textAlign: "center" }),
              icon: markRaw(MdiFormatAlignCenter),
              title: i18n.global.t("editor.common.align_center"),
              action: () => editor.chain().focus().setTextAlign("center").run(),
            },
          },
          {
            priority: 200,
            component: ToolbarButton,
            props: {
              isActive: editor.isActive({ textAlign: "right" }),
              icon: markRaw(MdiFormatAlignRight),
              title: i18n.global.t("editor.common.align_right"),
              action: () => editor.chain().focus().setTextAlign("right").run(),
            },
          },
          {
            priority: 210,
            component: ToolbarButton,
            props: {
              isActive: editor.isActive({ textAlign: "justify" }),
              icon: markRaw(MdiFormatAlignJustify),
              title: i18n.global.t("editor.common.align_justify"),
              action: () =>
                editor.chain().focus().setTextAlign("justify").run(),
            },
          },
        ];
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 120,
            component: BubbleButton,
            props: {
              isActive: editor.isActive({ textAlign: "left" }),
              icon: markRaw(MdiFormatAlignLeft),
              title: i18n.global.t("editor.common.align_left"),
              action: () => editor.chain().focus().setTextAlign("left").run(),
            },
          },
          {
            priority: 130,
            component: BubbleButton,
            props: {
              isActive: editor.isActive({ textAlign: "center" }),
              icon: markRaw(MdiFormatAlignCenter),
              title: i18n.global.t("editor.common.align_center"),
              action: () => editor.chain().focus().setTextAlign("center").run(),
            },
          },
          {
            priority: 140,
            component: BubbleButton,
            props: {
              isActive: editor.isActive({ textAlign: "right" }),
              icon: markRaw(MdiFormatAlignRight),
              title: i18n.global.t("editor.common.align_right"),
              action: () => editor.chain().focus().setTextAlign("right").run(),
            },
          },
          {
            priority: 150,
            component: BubbleButton,
            props: {
              isActive: editor.isActive({ textAlign: "justify" }),
              icon: markRaw(MdiFormatAlignJustify),
              title: i18n.global.t("editor.common.align_justify"),
              action: () =>
                editor.chain().focus().setTextAlign("justify").run(),
            },
          },
        ];
      },
    };
  },
});

export default TextAlign;
