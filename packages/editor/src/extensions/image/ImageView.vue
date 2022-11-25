<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed, ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

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

const src = computed(() => {
  return props.node.attrs.src;
});

const alt = computed({
  get: () => {
    return props.node?.attrs.alt;
  },
  set: (alt: string) => {
    props.updateAttributes({ alt: alt });
  },
});

const resizeRef = ref<HTMLElement>();

useResizeObserver(resizeRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  props.updateAttributes({ width: width, height: height });
});
</script>

<template>
  <node-view-wrapper as="div">
    <div
      ref="resizeRef"
      class="resize mt-4 mb-4 inline-block overflow-hidden transition-all text-center relative"
      :class="{
        'ring-2 rounded': selected,
      }"
      :style="{
        width: `${props.node.attrs.width}px`,
        height: `${props.node.attrs.height}px`,
      }"
    >
      <img
        :src="src"
        :title="node.attrs.title"
        :alt="alt"
        class="w-full h-full"
      />
    </div>
  </node-view-wrapper>
</template>
