import { Extension } from "@tiptap/core";
import type { ResolvedPos } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

let draggableHandleDom: HTMLElement | null = null;
let currEditorView: EditorView | null = null;
let activeNode: any = null;

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
  referenceRectDOM: HTMLElement
) => {
  const root = view.dom.parentElement;

  if (!root) {
    return;
  }

  if (!draggableHandleDom) {
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

const handleMouseEnterEvent = () => {};

const handleMouseLeaveEvent = () => {};

const handleMouseDownEvent = () => {};

const handleMouseUpEvent = () => {};

const handleDragStartEvent = () => {};

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

const Draggable = Extension.create({
  name: "draggable",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("node-draggable"),
        view: (view) => {
          draggableHandleDom = createDragHandleDom();
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
              const root = view.dom.parentElement;
              if (!root) return false;
              // 在 dom 上移动，获取当前生效的 node
              const coords = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coords);
              if (!pos || !pos.pos) return false;

              let dom =
                view.nodeDOM(pos.pos) ||
                view.domAtPos(pos.pos)?.node ||
                event.target;
              if (!dom) {
                hideDragHandleDOM();
                return false;
              }

              while (dom && dom.nodeType === 3) {
                dom = dom.parentElement;
              }
              if (!(dom instanceof Element)) {
                hideDragHandleDOM();
                return false;
              }
              // 从 dom 上获取 node
              const domPos = view.posAtDOM(dom, 0);
              if (domPos <= 0) {
                return false;
              }
              const $pos = view.state.doc.resolve(domPos);
              const node = $pos.node();
              console.log(node);
              console.log(this.editor.options);
              // TODO：对某些情况特殊处理，例如 table 的 th，ol 中的 li 等。需要手动指定渲染的内容。如果返回 false，则不渲染

              activeNode = node;

              const el = getDOMByPos(view, root, $pos);
              renderDragHandleDOM(view, el);
              return false;
            },
          },
          handleDrop: (view, event, slice, moved) => {
            return;
          },
        },
      }),
    ];
  },
});

export default Draggable;
