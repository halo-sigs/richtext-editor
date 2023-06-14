import type { Editor } from "@tiptap/vue-3";
import TiptapUnderline from "@tiptap/extension-underline";
import type { UnderlineOptions } from "@tiptap/extension-underline";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatUnderline from "~icons/mdi/format-underline";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import BubbleButton from "@/components/bubble/BubbleButton.vue";

const Underline = TiptapUnderline.extend<ExtensionOptions & UnderlineOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 60,
          component: ToolbarButton,
          props: {
            editor,
            isActive: editor.isActive("underline"),
            icon: markRaw(MdiFormatUnderline),
            title: i18n.global.t("editor.common.underline"),
            action: () => editor.chain().focus().toggleUnderline().run(),
          },
        };
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return {
          priority: 30,
          component: BubbleButton,
          props: {
            editor,
            isActive: editor.isActive("underline"),
            icon: markRaw(MdiFormatUnderline),
            title: i18n.global.t("editor.common.underline"),
            action: () => editor.chain().focus().toggleUnderline().run(),
          },
        };
      },
    };
  },
});

export default Underline;
