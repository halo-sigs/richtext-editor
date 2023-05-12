import {
  Node,
  VueNodeViewRenderer,
  mergeAttributes,
  nodeInputRule,
  nodePasteRule,
} from "@tiptap/vue-3";
import KatexRenderComponent from "./KatexRender.vue";

export const inlineInputRegex = /(?:^|\s)((?:\$)((?:[^*]+))(?:\$))$/;
export const inlinePasteRegex = /(?:^|\s)((?:\$)((?:[^*]+))(?:\$))/g;
export const blockInputRegex = /^\$\$[\s\n]$/;

export const ExtensionKatex2Inline = Node.create({
  name: "vueKatex2Inline",
  group: "inline math",
  inline: true,
  selectable: false,
  atom: true,
  allowGapCursor: false,
  code: true,

  addAttributes() {
    return {
      content: {
        default: "",
      },
      editMode: {
        default: false,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-inline-katex="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-inline-katex": "true" }),
      `$${HTMLAttributes.content}$`,
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexRenderComponent);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inlineInputRegex,
        type: this.type,
        getAttributes: (match) => {
          return {
            content: match[2],
          };
        },
      }),
    ];
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: inlinePasteRegex,
        type: this.type,
        getAttributes: (match) => {
          return {
            content: match[2],
          };
        },
      }),
    ];
  },
});

export const ExtensionKatex2Block = Node.create({
  name: "vueKatex2Block",
  group: "block math",
  selectable: true,
  defining: true,
  atom: true,
  allowGapCursor: false,
  code: true,

  addAttributes() {
    return {
      content: {
        default: "",
      },
      editMode: {
        default: false,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'p[data-block-katex="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, { "data-block-katex": "true" }),
      `$$${HTMLAttributes.content}$$`,
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexRenderComponent);
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: blockInputRegex,
        type: this.type,
        getAttributes: (_match) => {
          return {
            content: "",
            editMode: true,
          };
        },
      }),
    ];
  },
});
