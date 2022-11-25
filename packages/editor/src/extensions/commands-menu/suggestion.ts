import type { Editor, Range } from "@tiptap/vue-3";
import { VueRenderer } from "@tiptap/vue-3";
import type { Instance } from "tippy.js";
import tippy from "tippy.js";
import "tippy.js/dist/svg-arrow.css";
import CommandsView from "./CommandsView.vue";
import MdiFormatHeader1 from "~icons/mdi/format-header-1";
import MdiFormatHeader2 from "~icons/mdi/format-header-2";
import MdiFormatHeader3 from "~icons/mdi/format-header-3";
import MdiFormatHeader4 from "~icons/mdi/format-header-4";
import MdiFormatHeader5 from "~icons/mdi/format-header-5";
import MdiFormatHeader6 from "~icons/mdi/format-header-6";
import MdiCodeBracesBox from "~icons/mdi/code-braces-box";
// import MdiMathCompass from "~icons/mdi/math-compass";
import MdiWeb from "~icons/mdi/web";
import { markRaw, type Component } from "vue";
import type { SuggestionOptions } from "@tiptap/suggestion";

export interface Item {
  icon: Component;
  title: string;
  keywords: string[];
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export const CommandHeader1: Item = {
  icon: markRaw(MdiFormatHeader1),
  title: "一级标题",
  keywords: ["h1", "header1", "1", "yijibiaoti"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 1 })
      .run();
  },
};

export const CommandHeader2: Item = {
  icon: markRaw(MdiFormatHeader2),
  title: "二级标题",
  keywords: ["h2", "header2", "2", "erjibiaoti"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 2 })
      .run();
  },
};

export const CommandHeader3: Item = {
  icon: markRaw(MdiFormatHeader3),
  title: "三级标题",
  keywords: ["h3", "header3", "3", "sanjibiaoti"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 3 })
      .run();
  },
};

export const CommandHeader4: Item = {
  icon: markRaw(MdiFormatHeader4),
  title: "四级标题",
  keywords: ["h4", "header4", "4", "sijibiaoti"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 4 })
      .run();
  },
};

export const CommandHeader5: Item = {
  icon: markRaw(MdiFormatHeader5),
  title: "五级标题",
  keywords: ["h5", "header5", "5", "wujibiaoti"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 5 })
      .run();
  },
};

export const CommandHeader6: Item = {
  icon: markRaw(MdiFormatHeader6),
  title: "六级标题",
  keywords: ["h6", "header6", "6", "liujibiaoti"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 6 })
      .run();
  },
};

export const CommandCodeBlock: Item = {
  icon: markRaw(MdiCodeBracesBox),
  title: "代码块",
  keywords: ["codeblock", "daimakuai"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor.chain().focus().deleteRange(range).setCodeBlock().run();
  },
};

export const CommandIframe: Item = {
  icon: markRaw(MdiWeb),
  title: "嵌入网页",
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

export default {
  items: ({ query }: { query: string }): Item[] => {
    return [
      {
        icon: markRaw(MdiFormatHeader1),
        title: "一级标题",
        keywords: ["h1", "header1", "1", "yijibiaoti"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        icon: markRaw(MdiFormatHeader2),
        title: "二级标题",
        keywords: ["h2", "header2", "2", "erjibiaoti"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run();
        },
      },
      {
        icon: markRaw(MdiFormatHeader3),
        title: "三级标题",
        keywords: ["h3", "header3", "3", "sanjibiaoti"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run();
        },
      },
      {
        icon: markRaw(MdiFormatHeader4),
        title: "四级标题",
        keywords: ["h4", "header4", "4", "sijibiaoti"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 4 })
            .run();
        },
      },
      {
        icon: markRaw(MdiFormatHeader5),
        title: "五级标题",
        keywords: ["h5", "header5", "5", "wujibiaoti"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 5 })
            .run();
        },
      },
      {
        icon: markRaw(MdiFormatHeader6),
        title: "六级标题",
        keywords: ["h6", "header6", "6", "liujibiaoti"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 6 })
            .run();
        },
      },
      {
        icon: markRaw(MdiCodeBracesBox),
        title: "代码块",
        keywords: ["codeblock", "daimakuai"],
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setCodeBlock().run();
        },
      },
    ]
      .filter((item) =>
        [...item.keywords, item.title].some((keyword) =>
          keyword.includes(query)
        )
      )
      .slice(0, 10);
  },

  render: () => {
    let component: VueRenderer;
    let popup: Instance[];

    return {
      onStart: (props: Record<string, any>) => {
        component = new VueRenderer(CommandsView, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: Record<string, any>) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: Record<string, any>) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
} as Omit<SuggestionOptions<Item>, "editor">;
