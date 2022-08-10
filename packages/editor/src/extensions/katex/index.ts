import { mergeAttributes, Node, VueNodeViewRenderer } from "@tiptap/vue-3";
import KatexBlockViewRenderer from "./KatexBlockViewRenderer.vue";
import type { HTMLAttributes } from "vue";

export const KatexBlock = Node.create({
  name: "katexBlock",
  group: "block",
  selectable: false,

  addAttributes() {
    return {
      content: {
        default: "",
        renderHTML: (attributes) => {
          return {
            content: attributes.content,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "katex",
      },
      {
        tag: "dl",
        getAttrs: (element) => {
          const match = element.querySelector("math");
          if (!match) {
            return false;
          }

          return { content: match.getAttribute("alttext") };
        },
      },
    ];
  },

  renderHTML: ({ HTMLAttributes }) => {
    return ["katex", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexBlockViewRenderer);
  },

  addCommands() {
    return {
      addKatex:
        (attributes: { [attr: string]: any }) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const position = selection.$cursor
            ? selection.$cursor.pos
            : selection.$to.pos;
          const node = this.type.create(attributes);
          const transaction = state.tr.insert(position, node);
          dispatch(transaction);
        },
    };
  },
});
