import { Editor, VueNodeViewRenderer, type Range } from "@tiptap/vue-3";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import type { CodeBlockLowlightOptions } from "@tiptap/extension-code-block-lowlight";
import CodeBlockViewRenderer from "./CodeBlockViewRenderer.vue";
import ToolbarItem from "@/components/toolbar/ToolbarItem.vue";
import MdiCodeBracesBox from "~icons/mdi/code-braces-box";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import BubbleItem from "@/components/bubble/BubbleItem.vue";

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
          component: ToolbarItem,
          props: {
            editor,
            isActive: editor.isActive("codeBlock"),
            icon: markRaw(MdiCodeBracesBox),
            title: i18n.global.t("editor.common.codeblock"),
            action: () => editor.chain().focus().toggleCodeBlock().run(),
          },
        };
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return {
          priority: 90,
          component: BubbleItem,
          props: {
            editor,
            isActive: editor.isActive("codeBlock"),
            icon: markRaw(MdiCodeBracesBox),
            title: i18n.global.t("editor.common.codeblock"),
            action: () => editor.chain().focus().toggleCodeBlock().run(),
          },
        };
      },
      getCommandMenuItems() {
        return {
          priority: 80,
          icon: markRaw(MdiCodeBracesBox),
          title: "editor.common.codeblock",
          keywords: ["codeblock", "daimakuai"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run();
          },
        };
      },
    };
  },
});
