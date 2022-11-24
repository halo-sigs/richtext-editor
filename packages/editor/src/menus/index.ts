import type { Editor } from "@tiptap/vue-3";
import type { Component } from "vue";

import MdiFormatBold from "~icons/mdi/format-bold";
import MdiFormatItalic from "~icons/mdi/format-italic";
import MdiFormatStrikethrough from "~icons/mdi/format-strikethrough";
import MdiFormatHeaderPound from "~icons/mdi/format-header-pound";
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
    icon: MdiUndoVariant,
    title: "Undo",
    action: () => editor.chain().undo().run(),
    isActive: () => false,
  };
}

export function RedoMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiRedoVariant,
    title: "Redo",
    action: () => editor.chain().redo().run(),
    isActive: () => false,
  };
}

export function BoldMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatBold,
    title: "Bold",
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: () => editor.isActive("bold"),
  };
}

export function ItalicMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatItalic,
    title: "Italic",
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: () => editor.isActive("italic"),
  };
}

export function UnderlineMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatUnderline,
    title: "Underline",
    action: () => editor.chain().focus().toggleUnderline().run(),
    isActive: () => editor.isActive("underline"),
  };
}

export function StrikeMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatStrikethrough,
    title: "Strikethrough",
    action: () => editor.chain().focus().toggleStrike().run(),
    isActive: () => editor.isActive("strike"),
  };
}

export function QuoteMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatQuoteOpen,
    title: "Quote",
    action: () => editor.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.isActive("blockquote"),
  };
}

export function CodeMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiCodeTags,
    title: "Code",
    action: () => editor.chain().focus().toggleCode().run(),
    isActive: () => editor.isActive("code"),
  };
}

export function SuperScriptMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatSuperscript,
    title: "Superscript",
    action: () => editor.chain().focus().toggleSuperscript().run(),
    isActive: () => editor.isActive("superscript"),
  };
}

export function SubScriptMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatSubscript,
    title: "Subscript",
    action: () => editor.chain().focus().toggleSubscript().run(),
    isActive: () => editor.isActive("subscript"),
  };
}

export function CodeBlockMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiCodeBracesBox,
    title: "Code Block",
    action: () => editor.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.isActive("codeBlock"),
  };
}

export function HeadingMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatHeaderPound,
    title: "普通文本",
    isActive: () => editor.isActive("heading"),
    children: [
      {
        type: "button",
        icon: MdiFormatHeader1,
        title: "标题 1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive("heading", { level: 1 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader2,
        title: "标题 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader3,
        title: "标题 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.isActive("heading", { level: 3 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader4,
        title: "标题 4",
        action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => editor.isActive("heading", { level: 4 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader5,
        title: "标题 5",
        action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
        isActive: () => editor.isActive("heading", { level: 5 }),
      },
      {
        type: "button",
        icon: MdiFormatHeader6,
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
    icon: MdiFormatAlignLeft,
    title: "Align Left",
    action: () => editor.chain().focus().setTextAlign("left").run(),
    isActive: () => editor.isActive({ textAlign: "left" }),
  };
}

export function AlignCenterMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatAlignCenter,
    title: "Align Center",
    action: () => editor.chain().focus().setTextAlign("center").run(),
    isActive: () => editor.isActive({ textAlign: "center" }),
  };
}

export function AlignRightMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatAlignRight,
    title: "Align Right",
    action: () => editor.chain().focus().setTextAlign("right").run(),
    isActive: () => editor.isActive({ textAlign: "right" }),
  };
}

export function AlignJustifyMenuItem(editor: Editor): MenuItem {
  return {
    type: "button",
    icon: MdiFormatAlignJustify,
    title: "Align Justify",
    action: () => editor.chain().focus().setTextAlign("justify").run(),
    isActive: () => editor.isActive({ textAlign: "justify" }),
  };
}
