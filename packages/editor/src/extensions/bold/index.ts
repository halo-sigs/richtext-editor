import type { Editor } from "@tiptap/core";
import TiptapBold from "@tiptap/extension-bold";
import type { BoldOptions } from "@tiptap/extension-bold";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatBold from "~icons/mdi/format-bold";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import BubbleButton from "@/components/bubble/BubbleButton.vue";

const Bold = TiptapBold.extend<ExtensionOptions & BoldOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 40,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("bold"),
            icon: markRaw(MdiFormatBold),
            title: i18n.global.t("editor.common.bold"),
            action: () => editor.chain().focus().toggleBold().run(),
          },
        };
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return {
          priority: 10,
          component: BubbleButton,
          props: {
            isActive: editor.isActive("bold"),
            icon: markRaw(MdiFormatBold),
            title: i18n.global.t("editor.common.bold"),
            action: () => editor.chain().focus().toggleBold().run(),
          },
        };
      },
    };
  },
});

export default Bold;
