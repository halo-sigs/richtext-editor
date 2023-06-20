import TiptapLink from "@tiptap/extension-link";
import type { LinkOptions } from "@tiptap/extension-link";
import type { ExtensionOptions } from "@/types";
import type { Editor } from "@tiptap/vue-3";
import LinkBubbleButton from "./LinkBubbleButton.vue";
import MdiLinkVariantOff from "~icons/mdi/link-variant-off";
import MdiShare from "~icons/mdi/share";
import { markRaw } from "vue";
import BubbleItem from "@/components/bubble/BubbleItem.vue";
import { i18n } from "@/locales";

const Link = TiptapLink.extend<ExtensionOptions & LinkOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getBubbleItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 160,
            component: markRaw(LinkBubbleButton),
            props: {
              editor,
              isActive: editor.isActive("link"),
            },
          },
          {
            priority: 170,
            component: markRaw(BubbleItem),
            props: {
              editor,
              isActive: false,
              visible: editor.isActive("link"),
              icon: markRaw(MdiLinkVariantOff),
              title: i18n.global.t("editor.extensions.link.cancel_link"),
              action: () => editor.commands.unsetLink(),
            },
          },
          {
            priority: 180,
            component: markRaw(BubbleItem),
            props: {
              editor,
              isActive: false,
              visible: editor.isActive("link"),
              icon: markRaw(MdiShare),
              title: i18n.global.t("editor.common.tooltip.open_link"),
              action: () => {
                const attrs = editor.getAttributes("link");
                if (attrs?.href) {
                  window.open(attrs.href, "_blank");
                }
              },
            },
          },
        ];
      },
    };
  },
});

export default Link;
