import {
  Node,
  VueNodeViewRenderer,
  mergeAttributes,
  nodeInputRule,
} from "@tiptap/vue-3";
import KatexRenderComponent from "./KatexRender.vue";

export const inlineInputRegex = /(?:\$)([^\$]+)(?:\$)/;
export const blockInputRegex = /(?:\$\$)([^\$]+)(?:\$\$)/;

export const ExtensionKatex2Inline = Node.create({
  name: "vueKatex2Inline",
  group: "inline math",
  // content: 'block*',
  inline: true,
  atom: true,
  selectable: false,
  allowGapCursor: false,
  code: true,

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
        tag: "katex-inline",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["katex-inline", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexRenderComponent);
  },

  // addInputRules() {
  //   return [
  //     nodeInputRule({
  //       find: inlineInputRegex,
  //       type: this.type,
  //       getAttributes: (match) => {
  //         return {
  //           content: match[1],
  //         };
  //       },
  //     }),
  //   ];
  // },
});

export const ExtensionKatex2Block = Node.create({
  name: "vueKatex2Block",
  group: "block math",
  content: "block*",
  atom: true,
  selectable: false,
  allowGapCursor: false,
  code: true,

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
        tag: "katex-block",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["katex-block", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexRenderComponent);
  },

  // addInputRules() {
  //   return [
  //     nodeInputRule({
  //       find: blockInputRegex,
  //       type: this.type,
  //       getAttributes: (match) => {
  //         return {
  //           content: match[1],
  //         };
  //       },
  //     }),
  //   ];
  // },
});
