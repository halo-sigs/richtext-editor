<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed } from "vue";

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

const src = computed({
  get: () => {
    return props.node?.attrs.src;
  },
  set: (src: string) => {
    props.updateAttributes({ src: src });
  },
});
</script>

<template>
  <node-view-wrapper
    as="div"
    class="divide-gray-100 bg-gray-100 overflow-hidden rounded-md w-full my-3"
  >
    <div class="block w-full relative">
      <div class="px-2 py-1.5">
        <input
          v-model="src"
          class="block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="输入链接"
        />
      </div>
      <iframe
        v-if="src"
        class="rounded-md"
        :src="node!.attrs.src"
        :width="node.attrs.width"
        :height="node.attrs.height"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
      ></iframe>
    </div>
  </node-view-wrapper>
</template>
