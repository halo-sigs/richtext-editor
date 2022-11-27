import type { Editor } from "@tiptap/vue-3";
import { markRaw, type Component } from "vue";

import MdiFormatBold from "~icons/mdi/format-bold";
import MdiFormatItalic from "~icons/mdi/format-italic";
import MdiFormatStrikethrough from "~icons/mdi/format-strikethrough";
import MdiFormatHeaderPound from "~icons/mdi/format-header-pound";
import MdiFormatParagraph from "~icons/mdi/format-paragraph";
import MdiFormatHeader1 from "~icons/mdi/format-header-1";
import MdiFormatHeader2 from "~icons/mdi/format-header-2";
import MdiFormatHeader3 from "~icons/mdi/format-header-3";
import MdiFormatHeader4 from "~icons/mdi/format-header-4";
import MdiFormatHeader5 from "~icons/mdi/format-header-5";
import MdiFormatHeader6 from "~icons/mdi/format-header-6";
import MdiUndoVariant from "~icons/mdi/undo-variant";
import MdiRedoVariant from "~icons/mdi/redo-variant";
import MdiFormatUnderline from "~icons/mdi/format-underline";
import MdiFormatAlignLeft from "~icons/mdi/format-align-left";
import MdiFormatAlignCenter from "~icons/mdi/format-align-center";
import MdiFormatAlignRight from "~icons/mdi/format-align-right";
import MdiFormatAlignJustify from "~icons/mdi/format-align-justify";
import MdiFormatQuoteOpen from "~icons/mdi/format-quote-open";
import MdiCodeTags from "~icons/mdi/code-tags";
import MdiCodeBracesBox from "~icons/mdi/code-braces-box";
// import MdiMathCompass from "~icons/mdi/math-compass";
import MdiFormatSuperscript from "~icons/mdi/format-superscript";
import MdiFormatSubscript from "~icons/mdi/format-subscript";
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
import MdiFormatListBulleted from "~icons/mdi/format-list-bulleted";
import MdiFormatListCheckbox from "~icons/mdi/format-list-checkbox";
import MdiFormatListNumbered from "~icons/mdi/format-list-numbered";
import MdiFormatColorHighlight from "~icons/mdi/format-color-highlight";

export interface MenuItem {
  type: "button" | "separator";
  icon?: Component;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
  children?: MenuItem[];
}

export function UndoMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiUndoVariant),
    title: "撤销",
    action: () => editor.chain().undo().run(),
    isActive: () => false,
  };
}

export function RedoMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiRedoVariant),
    title: "恢复",
    action: () => editor.chain().redo().run(),
    isActive: () => false,
  };
}

export function BoldMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatBold),
    title: "粗体",
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: () => editor.isActive("bold"),
  };
}

export function ItalicMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatItalic),
    title: "斜体",
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: () => editor.isActive("italic"),
  };
}

export function UnderlineMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatUnderline),
    title: "下划线",
    action: () => editor.chain().focus().toggleUnderline().run(),
    isActive: () => editor.isActive("underline"),
  };
}

export function StrikeMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatStrikethrough),
    title: "删除线",
    action: () => editor.chain().focus().toggleStrike().run(),
    isActive: () => editor.isActive("strike"),
  };
}

export function QuoteMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatQuoteOpen),
    title: "引用",
    action: () => editor.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.isActive("blockquote"),
  };
}

export function CodeMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiCodeTags),
    title: "行内代码",
    action: () => editor.chain().focus().toggleCode().run(),
    isActive: () => editor.isActive("code"),
  };
}

export function SuperScriptMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatSuperscript),
    title: "上角标",
    action: () => editor.chain().focus().toggleSuperscript().run(),
    isActive: () => editor.isActive("superscript"),
  };
}

export function SubScriptMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatSubscript),
    title: "下角标",
    action: () => editor.chain().focus().toggleSubscript().run(),
    isActive: () => editor.isActive("subscript"),
  };
}

export function CodeBlockMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiCodeBracesBox),
    title: "代码块",
    action: () => editor.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.isActive("codeBlock"),
  };
}

export function HeadingMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatHeaderPound),
    title: "文本类型",
    isActive: () => editor.isActive("heading") || editor.isActive("paragraph"),
    children: [
      {
        type: "button",
        icon: markRaw(MdiFormatParagraph),
        title: "普通文本",
        action: () => editor.chain().focus().setParagraph().run(),
        isActive: () => editor.isActive("paragraph"),
      },
      {
        type: "button",
        icon: markRaw(MdiFormatHeader1),
        title: "标题 1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: markRaw(MdiFormatHeader2),
        title: "标题 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
      {
        type: "button",
        icon: markRaw(MdiFormatHeader3),
        title: "标题 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.isActive("heading", { level: 3 }),
      },
      {
        type: "button",
        icon: markRaw(MdiFormatHeader4),
        title: "标题 4",
        action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => editor.isActive("heading", { level: 4 }),
      },
      {
        type: "button",
        icon: markRaw(MdiFormatHeader5),
        title: "标题 5",
        action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
        isActive: () => editor.isActive("heading", { level: 5 }),
      },
      {
        type: "button",
        icon: markRaw(MdiFormatHeader6),
        title: "标题 6",
        action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
        isActive: () => editor.isActive("heading", { level: 6 }),
      },
    ],
  };
}

export function AlignLeftMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatAlignLeft),
    title: "左对齐",
    action: () => editor.chain().focus().setTextAlign("left").run(),
    isActive: () => editor.isActive({ textAlign: "left" }),
  };
}

export function AlignCenterMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatAlignCenter),
    title: "居中",
    action: () => editor.chain().focus().setTextAlign("center").run(),
    isActive: () => editor.isActive({ textAlign: "center" }),
  };
}

export function AlignRightMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatAlignRight),
    title: "右对齐",
    action: () => editor.chain().focus().setTextAlign("right").run(),
    isActive: () => editor.isActive({ textAlign: "right" }),
  };
}

export function AlignJustifyMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatAlignJustify),
    title: "两端对齐",
    action: () => editor.chain().focus().setTextAlign("justify").run(),
    isActive: () => editor.isActive({ textAlign: "justify" }),
  };
}

export function TableMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiTable),
    title: "表格",
    isActive: () => editor.isActive("heading"),
    children: [
      {
        type: "button",
        icon: markRaw(MdiTablePlus),
        title: "插入表格",
        action: () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableColumnPlusBefore),
        title: "向前插入列",
        action: () => editor.chain().focus().addColumnBefore().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableColumnPlusAfter),
        title: "向后插入列",
        action: () => editor.chain().focus().addColumnAfter().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableHeadersEye),
        title: "显示/隐藏列表头",
        action: () => editor.chain().focus().toggleHeaderColumn().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableColumnRemove),
        title: "删除当前列",
        action: () => editor.chain().focus().deleteColumn().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableRowPlusBefore),
        title: "向上插入行",
        action: () => editor.chain().focus().addRowBefore().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableRowPlusAfter),
        title: "向下插入行",
        action: () => editor.chain().focus().addRowAfter().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableHeadersEye),
        title: "显示/隐藏行表头",
        action: () => editor.chain().focus().toggleHeaderRow().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableRowRemove),
        title: "删除当前行",
        action: () => editor.chain().focus().deleteRow().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableMergeCells),
        title: "合并单元格",
        action: () => editor.chain().focus().mergeCells().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableSplitCell),
        title: "分割单元格",
        action: () => editor.chain().focus().splitCell().run(),
        isActive: () => false,
      },
      {
        type: "button",
        icon: markRaw(MdiTableRemove),
        title: "删除表格",
        action: () => editor.chain().focus().deleteTable().run(),
        isActive: () => false,
      },
    ],
  };
}

export function BulletListMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatListBulleted),
    title: "无序列表",
    action: () => editor.chain().focus().toggleBulletList().run(),
    isActive: () => editor.isActive("bulletList"),
  };
}

export function OrderedListMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatListNumbered),
    title: "有序列表",
    action: () => editor.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.isActive("orderedList"),
  };
}

export function TaskListMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatListCheckbox),
    title: "任务列表",
    action: () => editor.chain().focus().toggleTaskList().run(),
    isActive: () => editor.isActive("taskList"),
  };
}

export function HighlightMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: markRaw(MdiFormatColorHighlight),
    title: "高亮",
    action: () => editor.chain().focus().toggleHighlight().run(),
    isActive: () => editor.isActive("highlight"),
  };
}

export function Separator(): MenuItem {
  return {
    type: "separator",
  };
}
