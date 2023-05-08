import { markRaw } from "vue";
import type { Editor, Item } from "@halo-dev/richtext-editor";
import FluentMathFormula from "~icons/fluent/math-formula-16-regular";

export { ExtensionKatex2Block, ExtensionKatex2Inline } from "./katex2/index";

export const CommandKatex2Block: Item = {
  icon: markRaw(FluentMathFormula),
  title: "editor.extensions.commands_menu.formula_block",
  keywords: ["formula", "gongshi"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([{ type: "vueKatex2Block", attrs: { content: "1^1" } }])
      .run();
  },
};

export const CommandKatex2Inline: Item = {
  icon: markRaw(FluentMathFormula),
  title: "editor.extensions.commands_menu.formula_inline",
  keywords: ["formula", "gongshi"],
  command: ({ editor, range }: { editor: Editor; range: Range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        { type: "vueKatex2Inline", attrs: { content: "1^1" } },
        { type: "paragraph", content: "" },
      ])
      .run();
  },
};
