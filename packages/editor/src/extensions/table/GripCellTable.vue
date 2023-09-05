<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import {
  isColumnSelected,
  isRowSelected,
  isTableSelected,
  selectColumn,
  selectRow,
  selectTable,
} from "./util";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { addColumnAfter, addRowAfter } from "@tiptap/pm/tables";
import MdiPlus from "~icons/mdi/plus";
import { Tooltip } from "floating-vue";

const props = defineProps<{
  editor: Editor;
  type: "row" | "column" | "table";
  index: number;
  isLast: boolean;
}>();

const isSelected = computed(() => {
  switch (props.type) {
    case "table":
      return isTableSelected(props.editor.state.selection);
    case "row":
      return isRowSelected(props.index)(props.editor.state.selection);
    case "column":
      return isColumnSelected(props.index)(props.editor.state.selection);
    default:
      return false;
  }
});

const grip = ref();

const handleMouseDown = (event: Event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  let selection;
  if (props.type === "table") {
    selection = selectTable(props.editor.state.tr);
  } else if (props.type === "row") {
    selection = selectRow(props.index)(props.editor.state.tr);
  } else if (props.type === "column") {
    selection = selectColumn(props.index)(props.editor.state.tr);
  }
  if (selection) {
    props.editor.view.dispatch(selection);
  }
  console.log(event.target, grip.value);
  if (event.target != grip.value) {
    if (props.type === "row") {
      addRowAfter(props.editor.state, props.editor.view.dispatch);
    } else if (props.type === "column") {
      addColumnAfter(props.editor.state, props.editor.view.dispatch);
    }
  }
};
onMounted(() => {
  console.log("创建 GripCellTable", props.type);
});

onUnmounted(() => {
  console.log("卸载 GripCellTable", props.type);
});
</script>
<template>
  <a
    ref="grip"
    :class="{
      selected: isSelected,
      'grip-table': type === 'table',
      'grip-column': type === 'column',
      'grip-row': type === 'row',
      first: index === 0,
      last: isLast,
    }"
    @mousedown="handleMouseDown"
  >
    <Tooltip
      v-if="type !== 'table'"
      :triggers="['hover']"
      :shown="false"
      :auto-hide="true"
    >
      <MdiPlus class="plus-icon" />

      <template #popper>
        {{ type === "column" ? "向后增加一列" : "向后增加一行" }}
      </template>
    </Tooltip>
  </a>
</template>
<style lang="scss">
.grip-column {
  position: absolute;
  top: -12px;
  left: -1px;
  width: 100%;

  > div {
    position: absolute;
    top: -18px;
    left: 100%;
    transform: translateX(-8px);

    display: inline-block;
    width: 16px;
    height: 16px;

    font-size: 0;
    cursor: pointer;

    .plus-icon {
      font-size: inherit;
    }
  }

  &::before {
    content: "";
    position: absolute;
    left: 100%;
    bottom: 4px;
    transform: translateX(-1px);

    width: 4px;
    height: 4px;
    background-color: #d8d8d8;
    border-radius: 50%;
    display: block;
  }

  &::after {
    box-sizing: content-box;
    content: "";
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: #f6f8fa;
    border: 1px solid #d8d8d8;
    display: block;
  }

  &:hover {
    color: rgb(0 101 255);

    > div {
      font-size: 14px;
    }

    &::before {
      display: none;
    }

    &::after {
      background: #2584ff;
      border-color: #2584ff;
    }
  }

  &.last::after {
    border-top-right-radius: 3px;
  }

  &.selected::after {
    background: #2584ff;
    border-color: #2584ff;
  }
}

.grip-row {
  position: absolute;
  left: -12px;
  top: -1px;
  height: 100%;

  > div {
    transform: translateY(8px);
    position: absolute;
    left: -16px;
    bottom: 4px;

    display: inline-block;
    width: 16px;
    height: 16px;

    font-size: 0;
    cursor: pointer;

    .plus-icon {
      font-size: inherit;
    }
  }

  &::before {
    content: "";
    position: absolute;
    left: -10px;
    bottom: -2px;
    width: 4px;
    height: 4px;
    background-color: #d8d8d8;
    border-radius: 50%;
    display: block;
  }

  &::after {
    box-sizing: content-box;
    content: "";
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 10px;
    background: #f6f8fa;
    border: 1px solid #d8d8d8;
    display: block;
  }

  &:hover {
    color: rgb(0 101 255);

    > div {
      font-size: 14px;
    }

    &::before {
      display: none;
    }

    &::after {
      background: #2584ff;
      border-color: rgb(0 101 255);
    }
  }

  &.last::after {
    border-bottom-left-radius: 3px;
  }

  &.selected::after {
    background: #2584ff;
    border-color: rgb(0 101 255);
  }
}

.grip-table {
  &::after {
    box-sizing: content-box;
    content: "";
    cursor: pointer;
    position: absolute;
    top: -12px;
    left: -12px;
    display: block;
    background: #f6f8fa;
    width: 10px;
    height: 10px;
    border: 1px solid #d8d8d8;
    border-top-left-radius: 3px;
  }

  &:hover::after {
    background: #2584ff;
    border-color: rgb(0 101 255);
  }

  &.selected::after {
    background: #2584ff;
    border-color: rgb(0 101 255);
  }
}
</style>
