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
        tag: "span[display-inline]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "display-inline": "" }),
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
        tag: "div[display-block]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "display-block": "" }),
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
