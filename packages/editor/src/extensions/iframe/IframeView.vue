<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node, nodeInputRule } from "@tiptap/vue-3";
import { computed } from "vue";
import BlockCard from "@/components/BlockCard.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import { VTooltip } from "floating-vue";

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

function handleSetFocus() {
  props.editor.commands.setNodeSelection(props.getPos());
}

function handleOpenLink() {
  window.open(src.value, "_blank");
}
</script>

<template>
  <node-view-wrapper as="div">
    <block-card
      :editor="editor"
      :get-pos="getPos"
      :delete-node="deleteNode"
      :selected="selected"
    >
      <template #content>
        <div class="block w-full relative overflow-auto">
          <div class="py-1.5">
            <input
              v-model="src"
              class="block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入链接"
              tabindex="-1"
              @focus="handleSetFocus"
            />
          </div>
          <iframe
            v-if="src"
            class="rounded-md"
            :src="node!.attrs.src"
            :width="node.attrs.width"
            :height="node.attrs.height"
            scrolling="yes"
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
          ></iframe>
        </div>
      </template>
      <template #dropdownItems>
        <div
          v-tooltip="'打开链接'"
          class="editor-block__dropdown-item"
          @click="handleOpenLink"
        >
          <MdiLinkVariant />
        </div>
      </template>
    </block-card>
  </node-view-wrapper>
</template>
