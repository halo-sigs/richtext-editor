import type { Editor } from "@tiptap/core";
import TiptapParagraph from "@tiptap/extension-paragraph";
import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import ToolbarItem from "@/components/toolbar/ToolbarItem.vue";
import MdiFormatParagraph from "~icons/mdi/format-paragraph";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const Blockquote = TiptapParagraph.extend<ExtensionOptions & ParagraphOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 30,
          component: markRaw(ToolbarItem),
          props: {
            editor,
            isActive: editor.isActive("paragraph"),
            icon: markRaw(MdiFormatParagraph),
            tooltip: i18n.global.t("editor.common.heading.paragraph"),
            action: () => editor.chain().focus().setParagraph().run(),
          },
        };
      },
    };
  },
});

export default Blockquote;
