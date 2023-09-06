import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { cellsEqueal, getCellsInColumn } from "./util";
import GripCellTable from "./GripCellTable.vue";
import { createVNode } from "vue";
import { render } from "vue";
import type { VNode } from "vue";

export interface TableCellOptions {
  HTMLAttributes: Record<string, any>;
}

const TableCell = Node.create<TableCellOptions>({
  name: "tableCell",
  content: "block+",
  tableRole: "cell",
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      colspan: {
        default: 1,
        parseHTML: (element) => {
          const colspan = element.getAttribute("colspan");
          const value = colspan ? parseInt(colspan, 10) : 1;
          return value;
        },
      },
      rowspan: {
        default: 1,
        parseHTML: (element) => {
          const rowspan = element.getAttribute("rowspan");
          const value = rowspan ? parseInt(rowspan, 10) : 1;
          return value;
        },
      },
      colwidth: {
        default: [100],
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;
          return value;
        },
      },
      style: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "td" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addStorage() {
    const cellDoms = new Map<string, VNode>();
    return {
      cellDoms: cellDoms,
    };
  },

  onDestroy() {
    this.storage.cellDoms.forEach((node: VNode) => {
      render(null, node.el as HTMLElement);
    });
    this.storage.cellDoms.clear();
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    const storage = this.storage;
    return [
      new Plugin({
        key: new PluginKey("table-cell-control"),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInColumn(0)(selection);
            if (cells) {
              cells.forEach(({ pos }, index) => {
                if (index === 0) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      const key = "table" + index;
                      const isLast = index === cells.length - 1;
                      const props = {
                        editor,
                        type: "table",
                        pos: index,
                        isLast: isLast,
                      };
                      let instance = storage.cellDoms.get(key) as VNode;
                      if (instance) {
                        instance.props = props;
                      } else {
                        instance = createVNode(GripCellTable, props);
                        storage.cellDoms.set(key, instance);
                        render(instance, document.createElement("div"));
                      }
                      return instance.el as HTMLElement;
                    })
                  );
                }

                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const key = "row" + index;
                    let instance = storage.cellDoms.get(key) as VNode;
                    const isLast = index === cells.length - 1;
                    const props = {
                      editor,
                      type: "row",
                      index: index,
                      isLast: isLast,
                    };
                    if (instance) {
                      instance.props = props;
                    } else {
                      instance = createVNode(GripCellTable, props);
                      storage.cellDoms.set(key, instance);
                      render(instance, document.createElement("div"));
                    }
                    return instance.el as HTMLElement;
                  })
                );
              });
            }
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default TableCell;
