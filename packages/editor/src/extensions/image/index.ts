import TiptapImage from "@tiptap/extension-image";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ImageView from "./ImageView.vue";
import type { ImageOptions } from "@tiptap/extension-image";
import type { ExtensionOptions } from "@/types";
import type { Editor } from "@tiptap/vue-3";
import ToolboxItem from "@/components/toolbox/ToolboxItem.vue";
import MdiFileImageBox from "~icons/mdi/file-image-box";
import { markRaw } from "vue";
import { i18n } from "@/locales";

const Image = TiptapImage.extend<ExtensionOptions & ImageOptions>({
  inline() {
    return true;
  },

  group() {
    return "inline";
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: undefined,
        parseHTML: (element) => {
          const width =
            element.getAttribute("width") || element.style.width || null;
          return width;
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: undefined,
        parseHTML: (element) => {
          const height =
            element.getAttribute("height") || element.style.height || null;
          return height;
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
      style: {
        renderHTML() {
          return {
            style: "display: inline-block",
          };
        },
      },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageView);
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 10,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(MdiFileImageBox),
              title: i18n.global.t("editor.common.image"),
              action: () => {
                editor
                  .chain()
                  .focus()
                  .insertContent([{ type: "image", attrs: { src: "" } }])
                  .run();
              },
            },
          },
        ];
      },
    };
  },
});

export default Image;
