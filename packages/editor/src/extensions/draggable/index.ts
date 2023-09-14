import { Editor, Extension } from "@tiptap/core";
import type { Node, ResolvedPos } from "prosemirror-model";
import { NodeSelection, Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "@tiptap/pm/view";
import { __serializeForClipboard as serializeForClipboard } from "@tiptap/pm/view";
import type { ExtensionOptions } from "@/types";

// https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API
// https://github.com/ueberdosis/tiptap/blob/7832b96afbfc58574785043259230801e179310f/demos/src/Experiments/GlobalDragHandle/Vue/DragHandle.js

export interface ActiveNode {
  $pos: ResolvedPos;
  node: Node;
  el: HTMLElement;
  offset: number;
}

let draggableHandleDom: HTMLElement | null = null;
let currEditorView: EditorView;
let activeNode: ActiveNode | null = null;
let activeSelection: NodeSelection | null = null;
let mouseleaveTimer: any;
let dragging: any = false;

const createDragHandleDom = () => {
  const dom = document.createElement("div");
  dom.classList.add("draggable");
  dom.draggable = true;
  dom.setAttribute("data-drag-handle", "true");
  return dom;
};

const showDragHandleDOM = () => {
  draggableHandleDom?.classList?.add("show");
  draggableHandleDom?.classList?.remove("hide");
};

const hideDragHandleDOM = () => {
  draggableHandleDom?.classList?.remove("show");
  draggableHandleDom?.classList?.remove("active");
  draggableHandleDom?.classList?.add("hide");
};

/**
 * 渲染 Drag DOM
 * @param view
 * @param referenceRectDOM
 */
const renderDragHandleDOM = (
  view: EditorView,
  referenceRectDOM: HTMLElement | undefined
) => {
  const root = view.dom.parentElement;

  if (!root) {
    return;
  }

  if (!draggableHandleDom) {
    return;
  }

  if (!referenceRectDOM) {
    return;
  }

  const targetNodeRect = referenceRectDOM.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const handleRect = draggableHandleDom.getBoundingClientRect();

  const left = targetNodeRect.left - rootRect.left - handleRect.width - 5;
  const top =
    targetNodeRect.top - rootRect.top + handleRect.height / 2 + root.scrollTop;

  const offsetLeft = 0;

  draggableHandleDom.style.left = `${left + offsetLeft}px`;
  draggableHandleDom.style.top = `${top - 2}px`;

  showDragHandleDOM();
};

const handleMouseEnterEvent = () => {
  if (!activeNode) {
    return;
  }
  clearTimeout(mouseleaveTimer);
  showDragHandleDOM();
};

const handleMouseLeaveEvent = () => {
  if (!activeNode) {
    return;
  }
  hideDragHandleDOM();
};

const handleMouseDownEvent = () => {
  if (!activeNode) {
    return null;
  }
  if (NodeSelection.isSelectable(activeNode.node)) {
    const nodeSelection = NodeSelection.create(
      currEditorView.state.doc,
      activeNode.$pos.pos - activeNode.offset
    );
    currEditorView.dispatch(
      currEditorView.state.tr.setSelection(nodeSelection)
    );
    currEditorView.focus();
    activeSelection = nodeSelection;
    return nodeSelection;
  }

  return null;
};

const handleMouseUpEvent = () => {
  if (!dragging) return;

  dragging = false;
  activeSelection = null;
  activeNode = null;
};

/**
 * 定义拖拽数据
 */
const handleDragStartEvent = (event: DragEvent) => {
  dragging = true;
  if (event.dataTransfer && activeNode && activeSelection) {
    const slice = activeSelection.content();
    event.dataTransfer.effectAllowed = "move";

    const { dom, text } = serializeForClipboard(currEditorView, slice);
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/html", dom.innerHTML);
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.setDragImage(activeNode?.el as any, 0, 0);

    currEditorView.dragging = {
      slice,
      move: true,
    };
  }
};

const getDOMByPos = (
  view: EditorView,
  root: HTMLElement,
  $pos: ResolvedPos
) => {
  const { node } = view.domAtPos($pos.pos);

  let el: HTMLElement = node as HTMLElement;
  let parent = el.parentElement;
  while (parent && parent !== root && $pos.pos === view.posAtDOM(parent, 0)) {
    el = parent;
    parent = parent.parentElement;
  }

  return el;
};

const getPosByDOM = (view: EditorView, dom: Element): ResolvedPos | null => {
  const domPos = view.posAtDOM(dom, 0);
  if (domPos < 0) {
    return null;
  }
  const $pos = view.state.doc.resolve(domPos);
  return $pos;
};

const selectAncestorNodeByDom = (
  dom: Element,
  view: EditorView
): ActiveNode | null => {
  const root = view.dom.parentElement;
  if (!root) {
    return null;
  }
  const $pos = getPosByDOM(view, dom);
  if (!$pos) {
    return null;
  }
  const node = $pos.node();
  const el = getDOMByPos(view, root, $pos);
  return { node, $pos, el, offset: 1 };
};

/**
 * 根据扩展，获取不同的渲染位置
 *
 * @param editor
 * @param parentNode
 * @param dom
 * @returns
 **/
const getRenderContainer = (
  editor: Editor,
  parentNode: Node,
  dom: Element
): Element | null => {
  const extension = editor.extensionManager.extensions.find((extension) => {
    return extension.name === parentNode.type.name;
  });
  if (!extension) {
    return null;
  }
  const renderContainer = (
    extension.options as ExtensionOptions
  ).getDraggableRenderContainer?.({ editor, dom });
  if (renderContainer instanceof Element) {
    return renderContainer;
  }
  // TODO: 对于未实现 getDraggableRenderContainer() 的扩展，返回 null，不做处理
  return dom;
};

const Draggable = Extension.create({
  name: "draggable",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("node-draggable"),
        view: (view) => {
          draggableHandleDom = createDragHandleDom();
          // 绑定拖拽按钮自身的事件
          draggableHandleDom.addEventListener(
            "mouseenter",
            handleMouseEnterEvent
          );
          draggableHandleDom.addEventListener(
            "mouseleave",
            handleMouseLeaveEvent
          );
          draggableHandleDom.addEventListener(
            "mousedown",
            handleMouseDownEvent
          );
          draggableHandleDom.addEventListener("mouseup", handleMouseUpEvent);
          draggableHandleDom.addEventListener(
            "dragstart",
            handleDragStartEvent
          );
          const viewDomParentNode = view.dom.parentNode as HTMLElement;
          viewDomParentNode.appendChild(draggableHandleDom);
          viewDomParentNode.style.position = "relative";
          return {
            update: (view) => {
              currEditorView = view;
            },
            destroy: () => {
              if (!draggableHandleDom) {
                return;
              }
              clearTimeout(mouseleaveTimer);
              draggableHandleDom.removeEventListener(
                "mouseenter",
                handleMouseEnterEvent
              );
              draggableHandleDom.removeEventListener(
                "mouseleave",
                handleMouseLeaveEvent
              );
              draggableHandleDom.removeEventListener(
                "mousedown",
                handleMouseDownEvent
              );
              draggableHandleDom.removeEventListener(
                "mouseup",
                handleMouseUpEvent
              );
              draggableHandleDom.removeEventListener(
                "dragstart",
                handleDragStartEvent
              );
              draggableHandleDom.remove();
            },
          };
        },
        props: {
          handleDOMEvents: {
            mousemove: (view, event) => {
              // 在 dom 上移动，获取当前生效的 node
              const coords = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coords);
              if (!pos || !pos.pos) return false;

              const dragNode =
                view.nodeDOM(pos.pos) ||
                view.domAtPos(pos.pos)?.node ||
                event.target;

              if (!dragNode) {
                hideDragHandleDOM();
                return false;
              }

              let dom: Element | null = dragNode as Element;
              while (dom && dom.nodeType === 3) {
                dom = dom.parentElement;
              }
              if (!(dom instanceof Element)) {
                hideDragHandleDOM();
                return false;
              }

              let parentDom: Element | null = dom;
              while (parentDom && parentDom.parentElement !== view.dom) {
                parentDom = parentDom.parentElement;
              }
              const $pos = getPosByDOM(view, parentDom as Element);
              const parentNode = $pos?.node();
              // 委派给父 node 去处理
              if (parentNode) {
                dom = getRenderContainer(this.editor, parentNode, dom);
              }
              if (!dom) {
                return;
              }
              // 从 dom 上获取 node
              const nodeResult = selectAncestorNodeByDom(dom, view);
              activeNode = nodeResult;
              renderDragHandleDOM(view, nodeResult?.el);
              return false;
            },
            mouseleave: () => {
              clearTimeout(mouseleaveTimer);
              mouseleaveTimer = setTimeout(() => {
                hideDragHandleDOM();
              }, 400);
              return false;
            },
          },
          handleKeyDown(view, event) {
            if (!draggableHandleDom) return false;
            hideDragHandleDOM();
            return false;
          },
          handleDrop: (view, event, slice, moved) => {
            // TODO: 拖拽完成后的处理
            return false;
          },
        },
      }),
    ];
  },
});

export default Draggable;
