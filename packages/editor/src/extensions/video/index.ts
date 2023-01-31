import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import VideoView from "./VideoView.vue";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

const Video = Node.create({
  name: "video",

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
          return element.getAttribute("src");
        },
      },
      width: {
        default: "50%",
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
        default: "auto",
        parseHTML: (element) => {
          return element.getAttribute("height");
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
      autoplay: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("autoplay");
        },
        renderHTML: (attributes) => {
          return {
            autoplay: attributes.autoplay,
          };
        },
      },
      controls: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("controls");
        },
        renderHTML: (attributes) => {
          return {
            controls: attributes.controls,
          };
        },
      },
      loop: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("loop");
        },
        renderHTML: (attributes) => {
          return {
            loop: attributes.loop,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setVideo:
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
        find: /^\$video\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: "100%" };
        },
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(VideoView);
  },
});

export default Video;
