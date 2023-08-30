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
import VideoView from "./VideoView.vue";
import MdiVideo from "~icons/mdi/video";
import ToolboxItem from "@/components/toolbox/ToolboxItem.vue";
import { i18n } from "@/locales";
import MdiPlayCircle from "~icons/mdi/play-circle";
import MdiPlayCircleOutline from "~icons/mdi/play-circle-outline";
import MdiMotionPlayOutline from "~icons/mdi/motion-play-outline";
import MdiMotionPlay from "~icons/mdi/motion-play";
import MdiCogPlay from "~icons/mdi/cog-play";
import MdiCogPlayOutline from "~icons/mdi/cog-play-outline";
import { BlockActionSeparator } from "@/components";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

const Video = Node.create<ExtensionOptions>({
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
    return ["video", mergeAttributes(HTMLAttributes)];
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

  addOptions() {
    return {
      ...this.parent?.(),
      getCommandMenuItems() {
        return {
          priority: 100,
          icon: markRaw(MdiVideo),
          title: "editor.extensions.commands_menu.video",
          keywords: ["video", "shipin"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                { type: "video", attrs: { src: "" } },
                { type: "paragraph", content: "" },
              ])
              .run();
          },
        };
      },
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 20,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(MdiVideo),
              title: i18n.global.t("editor.extensions.commands_menu.video"),
              action: () => {
                editor
                  .chain()
                  .focus()
                  .insertContent([{ type: "video", attrs: { src: "" } }])
                  .run();
              },
            },
          },
        ];
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "videoBubbleMenu",
          shouldShow: () => {
            return editor.isActive(Video.name);
          },
          items: [
            {
              priority: 10,
              props: {
                isActive: () => {
                  editor.getAttributes(Video.name).controls;
                },
                icon: markRaw(
                  editor.getAttributes(Video.name).controls
                    ? MdiCogPlay
                    : MdiCogPlayOutline
                ),
                action: () => {
                  return editor
                    .chain()
                    .updateAttributes(Video.name, {
                      controls: editor.getAttributes(Video.name).controls
                        ? null
                        : true,
                    })
                    .setNodeSelection(editor.state.selection.from)
                    .focus()
                    .run();
                },
                title: editor.getAttributes(Video.name).controls
                  ? i18n.global.t("editor.extensions.video.disable_controls")
                  : i18n.global.t("editor.extensions.video.enable_controls"),
              },
            },
            {
              priority: 20,
              props: {
                isActive: () => {
                  return editor.getAttributes(Video.name).autoplay;
                },
                icon: markRaw(
                  editor.getAttributes(Video.name).autoplay
                    ? MdiPlayCircle
                    : MdiPlayCircleOutline
                ),
                action: () => {
                  return editor
                    .chain()
                    .updateAttributes(Video.name, {
                      autoplay: editor.getAttributes(Video.name).autoplay
                        ? null
                        : true,
                    })
                    .setNodeSelection(editor.state.selection.from)
                    .focus()
                    .run();
                },
                title: editor.getAttributes(Video.name).autoplay
                  ? i18n.global.t("editor.extensions.video.disable_autoplay")
                  : i18n.global.t("editor.extensions.video.enable_autoplay"),
              },
            },
            {
              priority: 30,
              props: {
                isActive: () => {
                  return editor.getAttributes(Video.name).loop;
                },
                icon: markRaw(
                  editor.getAttributes(Video.name).loop
                    ? MdiMotionPlay
                    : MdiMotionPlayOutline
                ),
                action: () => {
                  return editor
                    .chain()
                    .updateAttributes(Video.name, {
                      loop: editor.getAttributes(Video.name).loop ? null : true,
                    })
                    .setNodeSelection(editor.state.selection.from)
                    .focus()
                    .run();
                },
                title: editor.getAttributes(Video.name).loop
                  ? i18n.global.t("editor.extensions.video.disable_loop")
                  : i18n.global.t("editor.extensions.video.enable_loop"),
              },
            },
            {
              priority: 40,
              component: markRaw(BlockActionSeparator),
            },
          ],
        };
      },
    };
  },
});

export default Video;
