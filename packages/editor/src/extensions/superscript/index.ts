import type { Editor } from "@tiptap/core";
import TiptapSuperscript from "@tiptap/extension-superscript";
import type { SuperscriptExtensionOptions } from "@tiptap/extension-superscript";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatSuperscript from "~icons/mdi/format-superscript";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const Superscript = TiptapSuperscript.extend<
  ExtensionOptions & SuperscriptExtensionOptions
>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 110,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("superscript"),
            icon: markRaw(MdiFormatSuperscript),
            title: i18n.global.t("editor.common.superscript"),
            action: () => editor.chain().focus().toggleSuperscript().run(),
          },
        };
      },
    };
  },
});

export default Superscript;
