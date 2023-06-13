import type { ExtensionOptions } from "@/types";
import {
  Editor,
  mergeAttributes,
  Node,
  nodeInputRule,
  nodePasteRule,
  type Range,
} from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { markRaw } from "vue";
import IframeView from "./IframeView.vue";
import MdiWeb from "~icons/mdi/web";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType;
    };
  }
}

const Iframe = Node.create<ExtensionOptions>({
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
      frameborder: {
        default: "0",
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

  addPasteRules() {
    return [
      nodePasteRule({
        find: /<iframe.*?src="(.*?)".*?<\/iframe>/g,
        type: this.type,
        getAttributes: (match) => {
          const parse = document
            .createRange()
            .createContextualFragment(match[0]);

          const iframe = parse.querySelector("iframe");

          if (!iframe) {
            return;
          }

          return {
            src: iframe.src,
            width: iframe.width || "100%",
            height: iframe.height || "300px",
          };
        },
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(IframeView);
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getCommandMenuItems() {
        return {
          priority: 90,
          icon: markRaw(MdiWeb),
          title: "editor.extensions.commands_menu.iframe",
          keywords: ["iframe", "qianruwangye"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                { type: "iframe", attrs: { src: "" } },
                { type: "paragraph", content: "" },
              ])
              .run();
          },
        };
      },
    };
  },
});

export default Iframe;
