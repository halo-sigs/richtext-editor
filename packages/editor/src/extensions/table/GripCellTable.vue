<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import type { EditorState } from "prosemirror-state";
import { isTableSelected, selectTable } from "./util";
import { computed } from "vue";

const props = defineProps<{
  state: EditorState;
  editor: Editor;
  type: "row" | "column";
  index: number;
}>();

const handleMouseDown = (event: Event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  props.editor.view.dispatch(selectTable(props.editor.state.tr));
};

const isSelected = computed(() => {
  return isTableSelected(props.state.selection);
});
</script>
<template>
  <a
    class="grip-table"
    :class="{ selected: isSelected }"
    @mousedown="handleMouseDown"
  ></a>
</template>
<style>
.grip-table::after {
  box-sizing: content-box;
  content: "";
  cursor: pointer;
  position: absolute;
  top: -12px;
  left: -12px;
  display: block;
  background: #fff;
  width: 10px;
  height: 10px;
  border: 1px solid #d8d8d8;
  border-top-left-radius: 3px;
}

.grip-table:hover::after {
  background: #2584ff;
  border-color: rgb(0 101 255);
}

.grip-table.selected::after {
  background: #2584ff;
  border-color: rgb(0 101 255);
}
</style>
