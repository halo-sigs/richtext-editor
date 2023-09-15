# 扩展说明

本文档介绍如何对编辑器的功能进行扩展，包括但不限于扩展工具栏、悬浮工具栏、Slash Command、拖拽功能等。

> 对于 Tiptap 本身的扩展方式可以参考 <https://tiptap.dev/api/introduction>

## 1. 顶部工具栏扩展

顶部工具栏主要用于编辑器顶部功能区域内容的扩展。在 <https://github.com/halo-sigs/richtext-editor/pull/16> 中，我们实现了对顶部工具栏的扩展，如果需要添加额外的功能，只需要在具体的 Tiptap Extension 中的 `addOptions` 中定义 `getToolbarItems` 函数即可，如：

```ts
{
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return []
      },
    };
  },
}
```

其中 `getToolbarItems` 即为对顶部工具栏的扩展。其返回类型为：

```ts
// 工具栏
export interface ToolbarItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    isActive: boolean;
    disabled?: boolean;
    icon?: Component;
    title?: string;
    action?: () => void;
  };
  children?: ToolbarItem[];
}
```

```ts
// 工具栏
export interface ToolbarItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    isActive: boolean;
    disabled?: boolean;
    icon?: Component;
    title?: string;
    action?: () => void;
  };
  children?: ToolbarItem[];
}

// 悬浮菜单
export interface NodeBubbleMenu {
  pluginKey?: string;
  editor?: Editor;
  shouldShow: (props: {
    editor: Editor;
    node?: HTMLElement;
    view?: EditorView;
    state?: EditorState;
    oldState?: EditorState;
    from?: number;
    to?: number;
  }) => boolean;
  tippyOptions?: Record<string, unknown>;
  getRenderContainer?: (node: HTMLElement) => HTMLElement;
  defaultAnimation?: boolean;
  component?: Component;
  items?: BubbleItem[];
}

export interface BubbleItem {
  priority: number;
  component?: Component;
  props: {
    isActive: ({ editor }: { editor: Editor }) => boolean;
    visible?: ({ editor }: { editor: Editor }) => boolean;
    icon?: Component;
    iconStyle?: string;
    title?: string;
    action?: ({ editor }: { editor: Editor }) => any;
  };
}

// Slash Command
export interface CommandMenuItem {
  priority: number;
  icon: Component;
  title: string;
  keywords: string[];
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

// 工具箱（Toolbox）
export interface ToolboxItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    icon?: Component;
    title?: string;
    description?: string;
    action?: () => void;
  };
}
```

一个添加视频类型节点的示例：

```ts
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
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 10,
          component: markRaw(ToolbarItem),
          props: {
            editor,
            isActive: editor.isActive("video"),
            icon: markRaw(MdiVideo),
            title: "添加视频",
            action: () =>
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent([{ type: "video", attrs: { src: "" } }])
                .run(),
          },
        };
      },
      getCommandMenuItems() {
        return {
          priority: 10,
          icon: markRaw(MdiVideo),
          title: "添加视频",
          keywords: ["video"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([{ type: "video", attrs: { src: "" } }])
              .run();
          },
        };
      },
      getBubbleMenu({ editor }: { editor: Editor }) {
        return {
          pluginKey: "videoBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, Video.name);
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
                  ? "隐藏控制面板"
                  : "显示控制面板",
              },
            },
          ],
        };
      },
    };
  },
});

export default Video;
```
