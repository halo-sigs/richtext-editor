<script lang="ts" setup>
import type { PropType } from "vue";
import type { Editor, AnyExtension } from "@tiptap/core";
import { BubbleMenu, isTextSelection } from "@tiptap/vue-3";
import type { BubbleItem } from "@/types";
import type { EditorView } from "prosemirror-view";
import type { EditorState } from "prosemirror-state";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

function getBubbleItemsFromExtensions() {
  const extensionManager = props.editor?.extensionManager;
  return extensionManager.extensions
    .reduce((acc: BubbleItem[], extension: AnyExtension) => {
      const { getBubbleItems } = extension.options;

      if (!getBubbleItems) {
        return acc;
      }

      const items = getBubbleItems({
        editor: props.editor,
      });

      if (Array.isArray(items)) {
        return [...acc, ...items];
      }

      return [...acc, items];
    }, [])
    .sort((a, b) => a.priority - b.priority);
}

const getShouldShow = ({
  editor,
  view,
  state,
  from,
  to,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}) => {
  if (
    editor.isActive("image") ||
    editor.isActive("video") ||
    editor.isActive("audio") ||
    editor.isActive("iframe")
  ) {
    return false;
  }

  const { doc, selection } = state;
  const { empty } = selection;

  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(state.selection);

  const hasEditorFocus = view.hasFocus();

  if (
    !hasEditorFocus ||
    empty ||
    isEmptyTextBlock ||
    !props.editor.isEditable
  ) {
    return false;
  }

  return true;
};
</script>
<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{
      maxWidth: '100%',
      moveTransition: 'transform 0.2s ease-out',
    }"
    :should-show="getShouldShow"
  >
    <div
      class="bg-white flex items-center rounded p-1 border drop-shadow space-x-0.5"
    >
      <component
        :is="item.component"
        v-for="(item, index) in getBubbleItemsFromExtensions()"
        :key="index"
        v-bind="item.props"
      />
    </div>
  </bubble-menu>
</template>
