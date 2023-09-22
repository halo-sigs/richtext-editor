import { Extension } from "@tiptap/core";

import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface NodeSelectedOptions {
  className: string;
}

const NodeSelected = Extension.create<NodeSelectedOptions>({
  name: "nodeSelected",

  addOptions() {
    return {
      className: "has-node-selected",
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("nodeSelected"),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor;
            const { anchor } = selection;
            const decorations: Decoration[] = [];

            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, []);
            }

            doc.descendants((node, pos) => {
              if (node.isText) {
                return false;
              }

              const isCurrent =
                anchor >= pos && anchor <= pos + node.nodeSize - 1;

              if (!isCurrent) {
                return false;
              }

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className,
                })
              );
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default NodeSelected;
