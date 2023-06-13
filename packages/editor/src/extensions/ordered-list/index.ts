import type { Editor, Range } from "@tiptap/core";
import TiptapOrderedList from "@tiptap/extension-ordered-list";
import type { OrderedListOptions } from "@tiptap/extension-ordered-list";
import ExtensionListItem from "@tiptap/extension-list-item";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatListNumbered from "~icons/mdi/format-list-numbered";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const OrderedList = TiptapOrderedList.extend<
  ExtensionOptions & OrderedListOptions
>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 140,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("orderedList"),
            icon: markRaw(MdiFormatListNumbered),
            title: i18n.global.t("editor.common.ordered_list"),
            action: () => editor.chain().focus().toggleOrderedList().run(),
          },
        };
      },
      getCommandMenuItems() {
        return {
          priority: 140,
          icon: markRaw(MdiFormatListNumbered),
          title: "editor.common.ordered_list",
          keywords: ["orderedlist", "youxuliebiao"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          },
        };
      },
    };
  },
  addExtensions() {
    return [ExtensionListItem];
  },
});

export default OrderedList;
