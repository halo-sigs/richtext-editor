import { Editor, VueNodeViewRenderer } from "@tiptap/vue-3";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import type { CodeBlockLowlightOptions } from "@tiptap/extension-code-block-lowlight";
import CodeBlockViewRenderer from "./CodeBlockViewRenderer.vue";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiCodeBracesBox from "~icons/mdi/code-braces-box";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

export default CodeBlockLowlight.extend<
  ExtensionOptions & CodeBlockLowlightOptions
>({
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockViewRenderer);
  },
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 160,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("codeBlock"),
            icon: markRaw(MdiCodeBracesBox),
            title: i18n.global.t("editor.common.codeblock"),
            action: () => editor.chain().focus().toggleCodeBlock().run(),
          },
        };
      },
    };
  },
});
