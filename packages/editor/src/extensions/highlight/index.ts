import type { Editor } from "@tiptap/core";
import TiptapHighlight from "@tiptap/extension-highlight";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import MdiFormatColorHighlight from "~icons/mdi/format-color-highlight";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import HighlightBubbleItem from "./HighlightBubbleItem.vue";
import HighlightToolbarItem from "./HighlightToolbarItem.vue";

const Highlight = TiptapHighlight.extend<ExtensionOptions & HighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 80,
          component: markRaw(HighlightToolbarItem),
          props: {
            editor,
            isActive: editor.isActive("highlight"),
            icon: markRaw(MdiFormatColorHighlight),
            title: i18n.global.t("editor.common.highlight"),
          },
        };
      },
    };
  },
}).configure({ multicolor: true });

export default Highlight;
