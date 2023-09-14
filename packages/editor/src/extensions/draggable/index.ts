import { Editor, Extension, findParentNodeClosestToPos } from "@tiptap/core";
import type { Node, ResolvedPos } from "prosemirror-model";
import { NodeSelection, Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "@tiptap/pm/view";
import { __serializeForClipboard as serializeForClipboard } from "@tiptap/pm/view";
import type { DraggableItem, ExtensionOptions } from "@/types";

// https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API
// https://github.com/ueberdosis/tiptap/blob/7832b96afbfc58574785043259230801e179310f/demos/src/Experiments/GlobalDragHandle/Vue/DragHandle.js
export interface ActiveNode {
  $pos: ResolvedPos;
  node: Node;
  el: HTMLElement;
  offset: number;
  domOffsetLeft: number;
  domOffsetTop: number;
}

let draggableItem: DraggableItem | boolean | undefined = undefined;
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
  activeNode: ActiveNode | undefined
) => {
  const root = view.dom.parentElement;
  if (!root) {
    return;
  }

  if (!draggableHandleDom) {
    return;
  }

  const referenceRectDOM = activeNode?.el;
  if (!referenceRectDOM) {
    return;
  }

  const targetNodeRect = referenceRectDOM.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const handleRect = draggableHandleDom.getBoundingClientRect();

  const left =
    targetNodeRect.left -
    rootRect.left -
    handleRect.width -
    5 +
    activeNode.domOffsetLeft;
  const top =
    targetNodeRect.top -
    rootRect.top +
    handleRect.height / 2 +
    root.scrollTop +
    activeNode.domOffsetTop;

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

const getPosByDOM = (
  view: EditorView,
  dom: HTMLElement
): ResolvedPos | null => {
  const domPos = view.posAtDOM(dom, 0);
  if (domPos < 0) {
    return null;
  }
  const $pos = view.state.doc.resolve(domPos);
  return $pos;
};

export const selectAncestorNodeByDom = (
  dom: HTMLElement,
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
  return { node, $pos, el, offset: 1, domOffsetLeft: 0, domOffsetTop: 0 };
};

const getExtensionDraggableItem = (editor: Editor, node: Node) => {
  const extension = editor.extensionManager.extensions.find((extension) => {
    return extension.name === node.type.name;
  });
  if (!extension) {
    return;
  }
  const draggableItem = (extension.options as ExtensionOptions).getDraggable?.({
    editor,
  });
  return draggableItem;
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
  view: EditorView,
  draggableItem: DraggableItem | undefined,
  dom: HTMLElement
): ActiveNode | null => {
  const renderContainer = draggableItem?.getRenderContainer?.({ dom, view });
  const node = selectAncestorNodeByDom(renderContainer?.el || dom, view);
  return {
    el: renderContainer?.el || dom,
    node: renderContainer?.node || (node?.node as Node),
    $pos: renderContainer?.$pos || (node?.$pos as ResolvedPos),
    offset: renderContainer?.nodeOffset || (node?.offset as number),
    domOffsetLeft: renderContainer?.dragDomOffset?.x || 0,
    domOffsetTop: renderContainer?.dragDomOffset?.y || 0,
  };
};

const findParentNode = (view: EditorView, dom: HTMLElement) => {
  let activeDom: HTMLElement = dom;
  do {
    if (activeDom.hasAttribute("data-node-view-wrapper")) {
      break;
    }
    const parentDom = activeDom.parentElement;
    if (!parentDom) {
      break;
    }
    if (parentDom.classList.contains("ProseMirror")) {
      break;
    }
    activeDom = parentDom;
  } while (activeDom);

  const $pos = getPosByDOM(view, activeDom as HTMLElement);
  return $pos?.node();
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

              let dom: HTMLElement | null = dragNode as HTMLElement;
              while (dom && dom.nodeType === 3) {
                dom = dom.parentElement;
              }
              if (!(dom instanceof HTMLElement)) {
                hideDragHandleDOM();
                return false;
              }
              const parentNode = findParentNode(view, dom);
              if (!parentNode) {
                return false;
              }
              // 委派给父 node 去处理
              draggableItem = getExtensionDraggableItem(
                this.editor,
                parentNode
              );
              console.log(draggableItem);
              // 未实现 getDraggable() 或返回 false 时，跳过当前扩展
              if (!draggableItem) {
                return false;
              }
              if (typeof draggableItem === "boolean") {
                activeNode = selectAncestorNodeByDom(dom, view);
              } else {
                activeNode = getRenderContainer(view, draggableItem, dom);
              }
              if (!activeNode) {
                return;
              }
              renderDragHandleDOM(view, activeNode);
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
