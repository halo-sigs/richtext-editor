import type { Editor } from "@tiptap/core";
import TiptapHighlight from "@tiptap/extension-highlight";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import MdiFormatColorHighlight from "~icons/mdi/format-color-highlight";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import HighlightToolbarItem from "./HighlightToolbarItem.vue";

const Highlight = TiptapHighlight.extend<ExtensionOptions & HighlightOptions>({
  addAttributes() {
    if (!this.options.multicolor) {
      return {};
    }

    return {
      color: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("data-color") || element.style.backgroundColor,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }

          return {
            "data-color": attributes.color,
            style: `background-color: ${attributes.color}; color: inherit; display: inline-block;`,
          };
        },
      },
    };
  },
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
