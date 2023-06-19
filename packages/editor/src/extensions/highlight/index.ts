import type { Editor } from "@tiptap/core";
import TiptapHighlight from "@tiptap/extension-highlight";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import ToolbarItem from "@/components/toolbar/ToolbarItem.vue";
import MdiFormatColorHighlight from "~icons/mdi/format-color-highlight";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import BubbleItem from "@/components/bubble/BubbleItem.vue";

const Highlight = TiptapHighlight.extend<ExtensionOptions & HighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 80,
          component: ToolbarItem,
          props: {
            editor,
            isActive: editor.isActive("highlight"),
            icon: markRaw(MdiFormatColorHighlight),
            title: i18n.global.t("editor.common.highlight"),
            action: () => editor.chain().focus().toggleHighlight().run(),
          },
        };
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return {
          priority: 50,
          component: BubbleItem,
          props: {
            editor,
            isActive: editor.isActive("highlight"),
            icon: markRaw(MdiFormatColorHighlight),
            title: i18n.global.t("editor.common.highlight"),
            action: () => editor.chain().focus().toggleHighlight().run(),
          },
        };
      },
    };
  },
});

export default Highlight;
