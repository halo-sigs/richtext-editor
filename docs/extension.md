# 扩展说明

如何对编辑器的功能进行扩展。

主要介绍扩展工具栏、悬浮工具栏、以及 Slash Command（以下统称工具栏），对于 Tiptap 本身的扩展方式可以参考 <https://tiptap.dev/api/introduction>。

在 <https://github.com/halo-sigs/richtext-editor/pull/16> 中，我们对编辑器的工具栏的定义方式进行了重构，现在如果需要添加额外的工具栏按钮或者功能，只需要在具体的 Tiptap Extension 中的 `addOptions` 函数中定义即可，如：

```ts
{
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return []
      },
      getBubbleItems({ editor }: { editor: Editor }) {
        return []
      },
      getCommandMenuItems() {
        return [];
      },
    };
  },
}
```

其中对象的属性分别对应了工具栏的三个部分，分别是：

- `getToolbarItems`：工具栏
- `getBubbleItems`：悬浮工具栏
- `getCommandMenuItems`：Slash Command

对应的返回类型为：

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

// 悬浮工具栏
export interface BubbleItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    isActive: boolean;
    visible?: boolean;
    icon?: Component;
    title?: string;
    action?: () => void;
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
            action: () => editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                { type: "video", attrs: { src: "" } },
              ])
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
              .insertContent([
                { type: "video", attrs: { src: "" } },
              ])
              .run();
          },
        };
      },
    };
  },
});

export default Video;
```
