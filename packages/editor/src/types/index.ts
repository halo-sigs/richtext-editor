import type { Editor, Range } from "@tiptap/core";
import type { EditorState } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { Component } from "vue";
export interface ToolbarItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    isActive: boolean;
    disabled?: boolean;
    icon?: Component;
    title?: string;
    action?: () => void;
  };
  children?: ToolbarItem[];
}

interface BubbleItemProps {
  pluginKey?: string;
  editor: Editor;
  updateDelay: number;
  shouldShow: (props: {
    editor: Editor;
    view: EditorView;
    state: EditorState;
    oldState?: EditorState | undefined;
    from: number;
    to: number;
  }) => boolean;
}

export interface NodeBubbleMenu extends BubbleItemProps {
  component: Component;
}

export interface ToolboxItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    icon?: Component;
    title?: string;
    description?: string;
    action?: () => void;
  };
}

export interface ExtensionOptions {
  getToolbarItems?: ({
    editor,
  }: {
    editor: Editor;
  }) => ToolbarItem | ToolbarItem[];

  getCommandMenuItems?: () => CommandMenuItem | CommandMenuItem[];

  getBubbleMenu?: ({ editor }: { editor: Editor }) => NodeBubbleMenu;

  getToolboxItems?: ({
    editor,
  }: {
    editor: Editor;
  }) => ToolboxItem | ToolboxItem[];
}

export interface CommandMenuItem {
  priority: number;
  icon: Component;
  title: string;
  keywords: string[];
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}
