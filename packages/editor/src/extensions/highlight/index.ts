import type { Editor } from "@tiptap/core";
import TiptapHighlight from "@tiptap/extension-highlight";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatColorHighlight from "~icons/mdi/format-color-highlight";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const Highlight = TiptapHighlight.extend<ExtensionOptions & HighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 80,
          component: ToolbarButton,
          props: {
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
