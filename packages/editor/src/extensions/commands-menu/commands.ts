import type { Range } from "@tiptap/vue-3";
import { Editor, Extension } from "@tiptap/vue-3";
import Suggestion from "@tiptap/suggestion";

export default Extension.create({
  name: "commands-menu",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: Record<string, any>;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
