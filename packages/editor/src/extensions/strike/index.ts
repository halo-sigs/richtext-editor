import type { Editor } from "@tiptap/core";
import TiptapStrike from "@tiptap/extension-strike";
import type { StrikeOptions } from "@tiptap/extension-strike";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatStrikethrough from "~icons/mdi/format-strikethrough";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const Strike = TiptapStrike.extend<ExtensionOptions & StrikeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 70,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("strike"),
            icon: markRaw(MdiFormatStrikethrough),
            title: i18n.global.t("editor.common.strike"),
            action: () => editor.chain().focus().toggleStrike().run(),
          },
        };
      },
    };
  },
});

export default Strike;
