import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { cellsEqueal, getCellsInRow } from "./util";
import GripCellTable from "./GripCellTable.vue";
import { createVNode } from "vue";
import { render } from "vue";
import type { VNode } from "vue";

export interface TableCellOptions {
  HTMLAttributes: Record<string, any>;
}

const TableHeader = Node.create<TableCellOptions>({
  name: "tableHeader",
  content: "block+",
  tableRole: "header_cell",
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
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
    return [{ tag: "th" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "th",
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
        key: new PluginKey("table-header-control"),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInRow(0)(selection);
            if (cells) {
              cells.forEach(({ pos }, index) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const key = "column" + index;
                    const isLast = index === cells.length - 1;
                    const props = {
                      editor,
                      type: "column",
                      index: index,
                      isLast: isLast,
                    };
                    let instance = storage.cellDoms.get(key) as VNode;
                    if (instance) {
                      instance.props = props;
                    } else {
                      instance = createVNode(GripCellTable, props);
                      render(instance, document.createElement("div"));
                      storage.cellDoms.set(key, instance);
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

export default TableHeader;
