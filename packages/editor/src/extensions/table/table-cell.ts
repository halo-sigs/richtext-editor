import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import {
  getCellsInColumn,
  isRowSelected,
  isTableSelected,
  selectRow,
  selectTable,
} from "./util";
import { addRowAfter } from "@tiptap/pm/tables";
import { createApp } from "vue";
import { Dropdown as VDropdown } from "floating-vue";

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

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("table-cell-control"),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInColumn(0)(selection);
            console.log("cells", cells);
            if (cells) {
              cells.forEach(({ pos }, index) => {
                if (index === 0) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      let className = "grip-table";
                      const selected = isTableSelected(selection);
                      if (selected) {
                        className += " selected";
                      }
                      const grip = document.createElement("a");
                      grip.className = className;
                      grip.addEventListener("mousedown", (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        editor.view.dispatch(selectTable(editor.state.tr));
                      });
                      return grip;
                    })
                  );
                }
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const rowSelected = isRowSelected(index)(selection);
                    let className = "grip-row";
                    if (rowSelected) {
                      className += " selected";
                    }
                    if (index === 0) {
                      className += " first";
                    }
                    if (index === cells.length - 1) {
                      className += " last";
                    }
                    const grip = document.createElement("a");
                    // if (grip) {
                    //   createApp({
                    //     render(h) {
                    //       return h(VDropdown);
                    //     },
                    //   }).mount(grip);
                    // }

                    grip.className = className;
                    grip.addEventListener(
                      "mousedown",
                      (event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        editor.view.dispatch(selectRow(index)(editor.state.tr));

                        if (event.target !== grip) {
                          addRowAfter(editor.state, editor.view.dispatch);
                        }
                      },
                      true
                    );
                    return grip;
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
