import TiptapTable from "@tiptap/extension-table";
import type { TableOptions } from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import type { Editor, Range } from "@tiptap/vue-3";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiTable from "~icons/mdi/table";
import MdiTablePlus from "~icons/mdi/table-plus";
import MdiTableColumnPlusBefore from "~icons/mdi/table-column-plus-before";
import MdiTableColumnPlusAfter from "~icons/mdi/table-column-plus-after";
import MdiTableRowPlusAfter from "~icons/mdi/table-row-plus-after";
import MdiTableRowPlusBefore from "~icons/mdi/table-row-plus-before";
import MdiTableColumnRemove from "~icons/mdi/table-column-remove";
import MdiTableRowRemove from "~icons/mdi/table-row-remove";
import MdiTableRemove from "~icons/mdi/table-remove";
import MdiTableHeadersEye from "~icons/mdi/table-headers-eye";
import MdiTableMergeCells from "~icons/mdi/table-merge-cells";
import MdiTableSplitCell from "~icons/mdi/table-split-cell";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";
import ToolbarButtonItem from "@/components/toolbar/ToolbarButtonItem.vue";

const Table = TiptapTable.extend<ExtensionOptions & TableOptions>({
  addExtensions() {
    return [TableHeader, TableRow, TableCell];
  },
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 170,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("table"),
            icon: markRaw(MdiTable),
            title: i18n.global.t("editor.menus.table.title"),
          },
          children: [
            {
              priority: 10,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTablePlus),
                title: i18n.global.t("editor.menus.table.add"),
                action: () =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
              },
            },
            {
              priority: 20,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableColumnPlusBefore),
                title: i18n.global.t("editor.menus.table.add_column_before"),
                action: () => editor.chain().focus().addColumnBefore().run(),
              },
            },
            {
              priority: 30,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableColumnPlusAfter),
                title: i18n.global.t("editor.menus.table.add_column_after"),
                action: () => editor.chain().focus().addColumnAfter().run(),
              },
            },
            {
              priority: 40,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                type: "button",
                icon: markRaw(MdiTableHeadersEye),
                title: i18n.global.t("editor.menus.table.toggle_header_column"),
                action: () => editor.chain().focus().toggleHeaderColumn().run(),
              },
            },
            {
              priority: 50,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableColumnRemove),
                title: i18n.global.t("editor.menus.table.delete_column"),
                action: () => editor.chain().focus().deleteColumn().run(),
              },
            },
            {
              priority: 60,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableRowPlusBefore),
                title: i18n.global.t("editor.menus.table.add_row_before"),
                action: () => editor.chain().focus().addRowBefore().run(),
              },
            },
            {
              priority: 70,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableRowPlusAfter),
                title: i18n.global.t("editor.menus.table.add_row_after"),
                action: () => editor.chain().focus().addRowAfter().run(),
              },
            },
            {
              priority: 80,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableHeadersEye),
                title: i18n.global.t("editor.menus.table.toggle_header_row"),
                action: () => editor.chain().focus().toggleHeaderRow().run(),
              },
            },
            {
              priority: 90,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableRowRemove),
                title: i18n.global.t("editor.menus.table.delete_row"),
                action: () => editor.chain().focus().deleteRow().run(),
              },
            },
            {
              priority: 100,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableMergeCells),
                title: i18n.global.t("editor.menus.table.merge_cells"),
                action: () => editor.chain().focus().mergeCells().run(),
              },
            },
            {
              priority: 110,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableSplitCell),
                title: i18n.global.t("editor.menus.table.split_cell"),
                action: () => editor.chain().focus().splitCell().run(),
              },
            },
            {
              priority: 120,
              component: ToolbarButtonItem,
              props: {
                isActive: false,
                icon: markRaw(MdiTableRemove),
                title: i18n.global.t("editor.menus.table.delete_table"),
                action: () => editor.chain().focus().deleteTable().run(),
              },
            },
          ],
        };
      },
      getCommandMenuItems() {
        return {
          priority: 120,
          icon: markRaw(MdiTable),
          title: "editor.extensions.commands_menu.table",
          keywords: ["table", "biaoge"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          },
        };
      },
    };
  },
});

export default Table;
