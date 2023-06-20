import type { ExtensionOptions } from "@/types";
import {
  Editor,
  mergeAttributes,
  Node,
  nodeInputRule,
  type Range,
} from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { markRaw } from "vue";
import AudioView from "./AudioView.vue";
import MdiMusicCircleOutline from "~icons/mdi/music-circle-outline";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (options: { src: string }) => ReturnType;
    };
  }
}

const Audio = Node.create<ExtensionOptions>({
  name: "audio",

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
        default: true,
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
        tag: "audio",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["audio", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setAudio:
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
        find: /^\$audio\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: "100%" };
        },
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(AudioView);
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getCommandMenuItems() {
        return {
          priority: 110,
          icon: markRaw(MdiMusicCircleOutline),
          title: "editor.extensions.commands_menu.audio",
          keywords: ["audio", "yinpin"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                { type: "audio", attrs: { src: "" } },
                { type: "paragraph", content: "" },
              ])
              .run();
          },
        };
      },
    };
  },
});

export default Audio;
