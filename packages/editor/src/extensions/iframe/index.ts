import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import IframeView from "./IframeView.vue";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType;
    };
  }
}

const Iframe = Node.create({
  name: "iframe",

  inline() {
    return true;
  },

  group() {
    return "inline";
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          const src = element.getAttribute("src");
          return src;
        },
      },
      width: {
        default: "100%",
        parseHTML: (element) => {
          return element.getAttribute("width");
        },
        renderHTML(attributes) {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: "300px",
        parseHTML: (element) => {
          const height = element.getAttribute("height");
          return height;
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
      scrolling: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("scrolling");
        },
        renderHTML: (attributes) => {
          return {
            scrolling: attributes.scrolling,
          };
        },
      },
      border: {
        default: 0,
        parseHTML: (element) => {
          const border = element.getAttribute("border");
          return border ? parseInt(border, 10) : null;
        },
        renderHTML: (attributes) => {
          return {
            border: attributes.border,
          };
        },
      },
      frameborder: {
        default: "no",
        parseHTML: (element) => {
          return element.getAttribute("frameborder");
        },
        renderHTML: (attributes) => {
          return {
            frameborder: attributes.frameborder,
          };
        },
      },
      allowfullscreen: {
        default: true,
        parseHTML: (element) => {
          return element.getAttribute("allowfullscreen");
        },
        renderHTML: (attributes) => {
          return {
            allowfullscreen: attributes.allowfullscreen,
          };
        },
      },
      framespacing: {
        default: 0,
        parseHTML: (element) => {
          const framespacing = element.getAttribute("framespacing");
          return framespacing ? parseInt(framespacing, 10) : null;
        },
        renderHTML: (attributes) => {
          return {
            framespacing: attributes.framespacing,
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

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$iframe\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: "100%" };
        },
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(IframeView);
  },
});

export default Iframe;
