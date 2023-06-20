import type { Editor, Range } from "@tiptap/vue-3";
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

export interface BubbleItem {
  priority: number;
  component: Component;
  props: {
    editor: Editor;
    isActive: boolean;
    visible?: boolean;
    icon?: Component;
    title?: string;
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

  getBubbleItems?: ({
    editor,
  }: {
    editor: Editor;
  }) => BubbleItem | BubbleItem[];
}

export interface CommandMenuItem {
  priority: number;
  icon: Component;
  title: string;
  keywords: string[];
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}
