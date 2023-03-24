<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed } from "vue";
import BlockCard from "@/components/block/BlockCard.vue";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockActionSeparator from "@/components/block/BlockActionSeparator.vue";
import BlockActionInput from "@/components/block/BlockActionInput.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiImageSizeSelectActual from "~icons/mdi/image-size-select-actual";
import MdiImageSizeSelectSmall from "~icons/mdi/image-size-select-small";
import MdiImageSizeSelectLarge from "~icons/mdi/image-size-select-large";
import { i18n } from "@/locales";

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

const width = computed({
  get: () => {
    return props.node?.attrs.width;
  },
  set: (value: string) => {
    handleSetSize(value, height.value);
  },
});

const height = computed({
  get: () => {
    return props.node?.attrs.height;
  },
  set: (value: string) => {
    handleSetSize(width.value, value);
  },
});

function handleSetSize(width: string, height: string) {
  props.updateAttributes({ width, height });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
}

function handleOpenLink() {
  window.open(src.value, "_blank");
}
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
          class="inline-block overflow-hidden transition-all text-center relative"
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
      <template #actions>
        <BlockActionInput
          v-model.lazy.trim="width"
          :tooltip="i18n.global.t('editor.common.tooltip.custom_width_input')"
        />

        <BlockActionInput
          v-model.lazy.trim="height"
          :tooltip="i18n.global.t('editor.common.tooltip.custom_height_input')"
        />

        <BlockActionSeparator />

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.image.small_size')"
          :selected="node.attrs.width === '25%'"
          @click="handleSetSize('25%', 'auto')"
        >
          <template #icon>
            <MdiImageSizeSelectSmall />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.image.medium_size')"
          :selected="node.attrs.width === '50%'"
          @click="handleSetSize('50%', 'auto')"
        >
          <template #icon>
            <MdiImageSizeSelectLarge />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.image.large_size')"
          :selected="node.attrs.width === '100%'"
          @click="handleSetSize('100%', '100%')"
        >
          <template #icon>
            <MdiImageSizeSelectActual />
          </template>
        </BlockActionButton>

        <BlockActionSeparator />

        <BlockActionButton
          :tooltip="i18n.global.t('editor.common.tooltip.open_link')"
          @click="handleOpenLink"
        >
          <template #icon>
            <MdiLinkVariant />
          </template>
        </BlockActionButton>
      </template>
    </block-card>
  </node-view-wrapper>
</template>
