import type { Editor } from "@tiptap/core";
import TiptapBlockquote from "@tiptap/extension-blockquote";
import type { BlockquoteOptions } from "@tiptap/extension-blockquote";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatQuoteOpen from "~icons/mdi/format-quote-open";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import BubbleButton from "@/components/bubble/BubbleButton.vue";

const Blockquote = TiptapBlockquote.extend<
  ExtensionOptions & BlockquoteOptions
>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 90,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("blockquote"),
            icon: markRaw(MdiFormatQuoteOpen),
            title: i18n.global.t("editor.common.quote"),
            action: () => {
              editor.commands.toggleBlockquote();
            },
          },
        };
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return {
          priority: 60,
          component: BubbleButton,
          props: {
            isActive: editor.isActive("blockquote"),
            icon: markRaw(MdiFormatQuoteOpen),
            title: i18n.global.t("editor.common.quote"),
            action: () => {
              editor.commands.toggleBlockquote();
            },
          },
        };
      },
    };
  },
});

export default Blockquote;
