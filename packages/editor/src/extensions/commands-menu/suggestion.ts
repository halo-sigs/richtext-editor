import type { Editor, Range } from "@tiptap/vue-3";
import { VueRenderer } from "@tiptap/vue-3";
import type { Instance } from "tippy.js";
import tippy from "tippy.js";
import CommandsView from "./CommandsView.vue";
import MdiFormatBold from "~icons/mdi/format-bold";
import MdiFormatItalic from "~icons/mdi/format-italic";
import MdiFormatHeader1 from "~icons/mdi/format-header-1";
import MdiFormatHeader2 from "~icons/mdi/format-header-2";
import MdiFormatHeader3 from "~icons/mdi/format-header-3";
import MdiFormatHeader4 from "~icons/mdi/format-header-4";
import MdiFormatHeader5 from "~icons/mdi/format-header-5";
import MdiFormatHeader6 from "~icons/mdi/format-header-6";

export default {
  items: ({ query }: { query: string }) => {
    return [
      {
        icon: MdiFormatHeader1,
        title: "一级标题",
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
        icon: MdiFormatHeader2,
        title: "二级标题",
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
        icon: MdiFormatHeader3,
        title: "三级标题",
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
        icon: MdiFormatHeader4,
        title: "四级标题",
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
        icon: MdiFormatHeader5,
        title: "五级标题",
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
        icon: MdiFormatHeader6,
        title: "六级标题",
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
        icon: MdiFormatBold,
        title: "粗体",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setMark("bold").run();
        },
      },
      {
        icon: MdiFormatItalic,
        title: "斜体",
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setMark("italic").run();
        },
      },
    ]
      .filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
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
};
