import TiptapTable from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";

const Table = TiptapTable.extend({
  addExtensions() {
    return [TableHeader, TableRow, TableCell];
  },
});

export default Table;
