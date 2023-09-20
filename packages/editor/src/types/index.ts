import type { Editor, Range } from "@tiptap/core";
import type { Node, ResolvedPos, Slice } from "prosemirror-model";
import type { EditorState, Selection } from "prosemirror-state";
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

interface BubbleMenuProps {
  pluginKey?: string;
  editor?: Editor;
  shouldShow: (props: {
    editor: Editor;
    node?: HTMLElement;
    view?: EditorView;
    state?: EditorState;
    oldState?: EditorState;
    from?: number;
    to?: number;
  }) => boolean;
  tippyOptions?: Record<string, unknown>;
  getRenderContainer?: (node: HTMLElement) => HTMLElement;
  defaultAnimation?: boolean;
}

export interface NodeBubbleMenu extends BubbleMenuProps {
  component?: Component;
  items?: BubbleItem[];
}

export interface BubbleItem {
  priority: number;
  component?: Component;
  props: {
    isActive: ({ editor }: { editor: Editor }) => boolean;
    visible?: ({ editor }: { editor: Editor }) => boolean;
    icon?: Component;
    iconStyle?: string;
    title?: string;
    action?: ({ editor }: { editor: Editor }) => Component | void;
  };
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

  getDraggable?: ({ editor }: { editor: Editor }) => DraggableItem | boolean;
}

export interface CommandMenuItem {
  priority: number;
  icon: Component;
  title: string;
  keywords: string[];
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export interface DragSelectionNode {
  $pos?: ResolvedPos;
  node?: Node;
  el: HTMLElement;
  nodeOffset?: number;
  dragDomOffset?: {
    x: number;
    y: number;
  };
}

export interface DraggableItem {
  getRenderContainer?: ({
    dom,
    view,
  }: {
    dom: HTMLElement;
    view: EditorView;
  }) => DragSelectionNode;
  handleDrop?: ({
    view,
    event,
    slice,
    insertPos,
    node,
  }: {
    view: EditorView;
    event: DragEvent;
    slice: Slice;
    insertPos: number;
    node: Node;
  }) => boolean | void;
  // 是否允许拖拽查询向下传播
  allowPropagationDownward?: boolean;
}
