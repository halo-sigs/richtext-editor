import TiptapImage from "@tiptap/extension-image";
import { VueNodeViewRenderer, isActive } from "@tiptap/vue-3";
import ImageView from "./ImageView.vue";
import type { ImageOptions } from "@tiptap/extension-image";
import type { ExtensionOptions } from "@/types";
import type { Editor } from "@tiptap/vue-3";
import ToolboxItem from "@/components/toolbox/ToolboxItem.vue";
import MdiFileImageBox from "~icons/mdi/file-image-box";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { EditorState } from "prosemirror-state";
import BubbleItemImageSize from "./BubbleItemImageSize.vue";
import BubbleItemImageAlt from "./BubbleItemImageAlt.vue";
import BubbleItemVideoLink from "./BubbleItemImageLink.vue";
import { BlockActionSeparator } from "@/components";
import MdiFormatAlignLeft from "~icons/mdi/format-align-left";
import MdiFormatAlignCenter from "~icons/mdi/format-align-center";
import MdiFormatAlignRight from "~icons/mdi/format-align-right";
import MdiFormatAlignJustify from "~icons/mdi/format-align-justify";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiShare from "~icons/mdi/share";
import MdiTextBoxEditOutline from "~icons/mdi/text-box-edit-outline";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import { deleteNode } from "@/utils";

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
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "imageBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }): boolean => {
            return isActive(state, Image.name);
          },
          items: [
            {
              priority: 10,
              component: markRaw(BubbleItemImageSize),
            },
            {
              priority: 20,
              props: {
                isActive: () => editor.isActive({ textAlign: "left" }),
                icon: markRaw(MdiFormatAlignLeft),
                action: () => handleSetTextAlign(editor, "left"),
              },
            },
            {
              priority: 30,
              props: {
                isActive: () => editor.isActive({ textAlign: "center" }),
                icon: markRaw(MdiFormatAlignCenter),
                action: () => handleSetTextAlign(editor, "center"),
              },
            },
            {
              priority: 40,
              props: {
                isActive: () => editor.isActive({ textAlign: "right" }),
                icon: markRaw(MdiFormatAlignRight),
                action: () => handleSetTextAlign(editor, "right"),
              },
            },
            {
              priority: 50,
              props: {
                isActive: () => editor.isActive({ textAlign: "justify" }),
                icon: markRaw(MdiFormatAlignJustify),
                action: () => handleSetTextAlign(editor, "justify"),
              },
            },
            {
              priority: 60,
              component: markRaw(BlockActionSeparator),
            },
            {
              priority: 70,
              props: {
                icon: markRaw(MdiLinkVariant),
                title: i18n.global.t("editor.common.button.edit_link"),
                action: () => {
                  return markRaw(BubbleItemVideoLink);
                },
              },
            },
            {
              priority: 80,
              props: {
                icon: markRaw(MdiShare),
                title: i18n.global.t("editor.common.tooltip.open_link"),
                action: () =>
                  window.open(editor.getAttributes(Image.name).src, "_blank"),
              },
            },
            {
              priority: 90,
              props: {
                icon: markRaw(MdiTextBoxEditOutline),
                title: i18n.global.t("editor.extensions.image.edit_alt"),
                action: () => {
                  return markRaw(BubbleItemImageAlt);
                },
              },
            },
            {
              priority: 100,
              component: markRaw(BlockActionSeparator),
            },
            {
              priority: 110,
              props: {
                icon: markRaw(MdiDeleteForeverOutline),
                title: i18n.global.t("editor.common.button.delete"),
                action: ({ editor }) => deleteNode(Image.name, editor),
              },
            },
          ],
        };
      },
    };
  },
});

const handleSetTextAlign = (
  editor: Editor,
  align: "left" | "center" | "right" | "justify"
) => {
  editor.chain().focus().setTextAlign(align).run();
};

export default Image;
