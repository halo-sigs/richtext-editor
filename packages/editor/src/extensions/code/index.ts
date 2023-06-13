import type { Editor } from "@tiptap/core";
import TiptapCode from "@tiptap/extension-code";
import type { CodeOptions } from "@tiptap/extension-code";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiCodeTags from "~icons/mdi/code-tags";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const Code = TiptapCode.extend<ExtensionOptions & CodeOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 100,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("code"),
            icon: markRaw(MdiCodeTags),
            title: i18n.global.t("editor.common.code"),
            action: () => editor.chain().focus().toggleCode().run(),
          },
        };
      },
    };
  },
});

export default Code;
