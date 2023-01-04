<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed, onMounted } from "vue";
import BlockCard from "@/components/BlockCard.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiImageSizeSelectActual from "~icons/mdi/image-size-select-actual";
import MdiImageSizeSelectSmall from "~icons/mdi/image-size-select-small";
import MdiImageSizeSelectLarge from "~icons/mdi/image-size-select-large";
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

function handleSetSize(width: string, height: string) {
  props.updateAttributes({ width, height });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
}

function handleOpenLink() {
  window.open(src.value, "_blank");
}

onMounted(() => {
  console.log(props.node);
});
</script>

<template>
  <node-view-wrapper as="div">
    <block-card
      :selected="selected"
      :editor="editor"
      :delete-node="deleteNode"
      :get-pos="getPos"
    >
      <template #content>
        <div
          class="resize mt-4 mb-4 inline-block overflow-hidden transition-all text-center relative"
          :class="{
            'ring-2 rounded': selected,
          }"
          :style="{
            width: node.attrs.width,
            height: node.attrs.height,
          }"
        >
          <img
            :src="src"
            :title="node.attrs.title"
            :alt="alt"
            class="w-full h-full"
          />
        </div>
      </template>
      <template #dropdownItems>
        <div
          v-tooltip="'小尺寸'"
          class="editor-block__dropdown-item"
          :class="{
            'editor-block__dropdown-item--selected': node.attrs.width === '25%',
          }"
          @click="handleSetSize('25%', 'auto')"
        >
          <MdiImageSizeSelectSmall />
        </div>

        <div
          v-tooltip="'中尺寸'"
          class="editor-block__dropdown-item"
          :class="{
            'editor-block__dropdown-item--selected': node.attrs.width === '50%',
          }"
          @click="handleSetSize('50%', 'auto')"
        >
          <MdiImageSizeSelectLarge />
        </div>

        <div
          v-tooltip="'全尺寸'"
          class="editor-block__dropdown-item"
          :class="{
            'editor-block__dropdown-item--selected':
              node.attrs.width === '100%',
          }"
          @click="handleSetSize('100%', '100%')"
        >
          <MdiImageSizeSelectActual />
        </div>

        <div class="editor-block__dropdown-separator"></div>

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
