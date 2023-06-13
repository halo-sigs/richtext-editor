import type { Editor } from "@tiptap/core";
import TiptapHistory from "@tiptap/extension-history";
import type { HistoryOptions } from "@tiptap/extension-history";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiUndoVariant from "~icons/mdi/undo-variant";
import MdiRedoVariant from "~icons/mdi/redo-variant";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const History = TiptapHistory.extend<ExtensionOptions & HistoryOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 10,
            component: ToolbarButton,
            props: {
              isActive: false,
              icon: markRaw(MdiUndoVariant),
              title: i18n.global.t("editor.menus.undo"),
              action: () => editor.chain().undo().focus().run(),
            },
          },
          {
            priority: 20,
            component: ToolbarButton,
            props: {
              isActive: false,
              icon: markRaw(MdiRedoVariant),
              title: i18n.global.t("editor.menus.redo"),
              action: () => editor.chain().redo().focus().run(),
            },
          },
        ];
      },
    };
  },
});

export default History;
