// Tiptap official extensions
import ExtensionBlockquote from "@tiptap/extension-blockquote";
import ExtensionBold from "@tiptap/extension-bold";
import ExtensionBulletList from "@tiptap/extension-bullet-list";
import ExtensionCode from "@tiptap/extension-code";
import ExtensionDocument from "@tiptap/extension-document";
import ExtensionDropcursor from "@tiptap/extension-dropcursor";
import ExtensionGapcursor from "@tiptap/extension-gapcursor";
import ExtensionHardBreak from "@tiptap/extension-hard-break";
import ExtensionHeading from "@tiptap/extension-heading";
import ExtensionHistory from "@tiptap/extension-history";
import ExtensionHorizontalRule from "@tiptap/extension-horizontal-rule";
import ExtensionItalic from "@tiptap/extension-italic";
import ExtensionListItem from "@tiptap/extension-list-item";
import ExtensionOrderedList from "@tiptap/extension-ordered-list";
import ExtensionParagraph from "@tiptap/extension-paragraph";
import ExtensionStrike from "@tiptap/extension-strike";
import ExtensionText from "@tiptap/extension-text";
import ExtensionTaskList from "@tiptap/extension-task-list";
import ExtensionTaskItem from "@tiptap/extension-task-item";
import ExtensionLink from "@tiptap/extension-link";
import ExtensionTextAlign from "@tiptap/extension-text-align";
import ExtensionUnderline from "@tiptap/extension-underline";
import ExtensionSubscript from "@tiptap/extension-subscript";
import ExtensionSuperscript from "@tiptap/extension-superscript";
import ExtensionPlaceholder from "@tiptap/extension-placeholder";
import ExtensionHighlight from "@tiptap/extension-highlight";
import { i18n } from "@/locales";

// Custom extensions
import {
  CommandsSuggestion,
  ExtensionCommands,
} from "../extensions/commands-menu";
import { ExtensionCodeBlock, lowlight } from "@/extensions/code-block";
import ExtensionIframe from "./iframe";
import ExtensionVideo from "./video";
import ExtensionAudio from "./audio";
import ExtensionImage from "./image";
import ExtensionTable from "./table";

const allExtensions = [
  ExtensionBlockquote,
  ExtensionBold,
  ExtensionBulletList,
  ExtensionCode,
  ExtensionDocument,
  ExtensionDropcursor,
  ExtensionGapcursor,
  ExtensionHardBreak,
  ExtensionHeading,
  ExtensionHistory,
  ExtensionHorizontalRule,
  ExtensionItalic,
  ExtensionListItem,
  ExtensionOrderedList,
  ExtensionParagraph,
  ExtensionStrike,
  ExtensionText,
  ExtensionImage,
  ExtensionTaskList,
  ExtensionTaskItem,
  ExtensionHighlight,
  ExtensionLink.configure({
    autolink: true,
    openOnClick: false,
  }),
  ExtensionTextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  ExtensionUnderline,
  ExtensionTable.configure({
    resizable: true,
  }),
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionPlaceholder.configure({
    placeholder: i18n.global.t("editor.extensions.commands_menu.placeholder"),
  }),
  ExtensionCommands.configure({
    suggestion: {},
  }),
  ExtensionCodeBlock.configure({
    lowlight,
  }),
  ExtensionIframe,
  ExtensionVideo,
  ExtensionAudio,
];

export {
  allExtensions,
  ExtensionBlockquote,
  ExtensionBold,
  ExtensionBulletList,
  ExtensionCode,
  ExtensionDocument,
  ExtensionDropcursor,
  ExtensionGapcursor,
  ExtensionHardBreak,
  ExtensionHeading,
  ExtensionHistory,
  ExtensionHorizontalRule,
  ExtensionItalic,
  ExtensionListItem,
  ExtensionOrderedList,
  ExtensionParagraph,
  ExtensionStrike,
  ExtensionText,
  ExtensionImage,
  ExtensionTaskList,
  ExtensionTaskItem,
  ExtensionLink,
  ExtensionTextAlign,
  ExtensionUnderline,
  ExtensionTable,
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionPlaceholder,
  ExtensionHighlight,
  ExtensionCommands,
  CommandsSuggestion,
  ExtensionCodeBlock,
  lowlight,
  ExtensionIframe,
  ExtensionVideo,
  ExtensionAudio,
};
