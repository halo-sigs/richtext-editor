import type { Editor } from "@tiptap/core";
import TiptapBulletList from "@tiptap/extension-bullet-list";
import type { BulletListOptions } from "@tiptap/extension-bullet-list";
import ExtensionListItem from "@tiptap/extension-list-item";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatListBulleted from "~icons/mdi/format-list-bulleted";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const BulletList = TiptapBulletList.extend<
  ExtensionOptions & BulletListOptions
>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 130,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("bulletList"),
            icon: markRaw(MdiFormatListBulleted),
            title: i18n.global.t("editor.common.bullet_list"),
            action: () => editor.chain().focus().toggleBulletList().run(),
          },
        };
      },
    };
  },
  addExtensions() {
    return [ExtensionListItem];
  },
});

export default BulletList;
