import type { Editor, Range } from "@tiptap/vue-3";
import type { Component } from "vue";

export interface MenuItem {
  type: "button" | "separator";
  icon?: Component;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
  children?: MenuItem[];
}

export interface ToolbarButton {
  priority: number;
  component: Component;
  props: {
    isActive: boolean;
    icon: Component;
    title?: string;
    action?: () => void;
  };
  children?: ToolbarButton[];
}

export interface ExtensionOptions {
  getToolbarItems?: ({
    editor,
  }: {
    editor: Editor;
  }) => ToolbarButton | ToolbarButton[];

  getCommandMenuItems?: () => CommandMenuItem | CommandMenuItem[];
}

export interface CommandMenuItem {
  priority: number;
  icon: Component;
  title: string;
  keywords: string[];
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}
