<script setup lang="ts">
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import {
  NodeViewWrapper,
  NodeViewContent,
  type Editor,
  type Node,
} from "@tiptap/vue-3";
import type { Decoration } from "prosemirror-view";
import { watch } from "vue";
import { computed, ref } from "vue";

const props = defineProps<{
  editor: Editor;
  node: ProseMirrorNode;
  decorations: Decoration[];
  selected: boolean;
  extension: Node<any, any>;
  getPos: () => number;
  updateAttributes: (attributes: Record<string, any>) => void;
  deleteNode: () => void;
}>();

const tableWidth = ref(0);
const fixedWidth = ref(true);
const columnWidths = ref<number[]>([]);

watch(
  props.node,
  () => {
    const widths: number[] = [];
    const row = props.node.firstChild;
    let totalWidth = 0;
    if (!row) {
      columnWidths.value = widths;
      return;
    }
    for (let i = 0, col = 0; i < row.childCount; i += 1) {
      const { colspan, colwidth } = row.child(i).attrs;

      for (let j = 0; j < colspan; j += 1, col += 1) {
        const hasWidth = colwidth && colwidth[j];
        const cssWidth = hasWidth ? hasWidth : 0;

        totalWidth += hasWidth || props.extension.options.cellMinWidth;

        if (!hasWidth) {
          fixedWidth.value = false;
        }
        widths.push(cssWidth);
      }
    }

    tableWidth.value = totalWidth;
    columnWidths.value = widths;
  },
  {
    immediate: true,
    deep: true,
  }
);

const tableStyle = computed(() => {
  if (fixedWidth.value) {
    return {
      width: `${tableWidth.value}px`,
    };
  }
  return { minWidth: `${tableWidth.value}px` };
});
</script>
<template>
  <node-view-wrapper as="div" class="tableWrapper">
    <div class="scrollWrapper">
      <table :style="tableStyle">
        <colgroup>
          <col
            v-for="(width, index) in columnWidths"
            :key="index"
            :style="{ width: `${width}px` }"
          />
        </colgroup>
        <node-view-content as="tbody" />
      </table>
    </div>
  </node-view-wrapper>
</template>
