<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed } from "vue";
import BlockCard from "@/components/block/BlockCard.vue";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockActionSeparator from "@/components/block/BlockActionSeparator.vue";
import BlockActionInput from "@/components/block/BlockActionInput.vue";
import { Dropdown as VDropdown } from "floating-vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiShare from "~icons/mdi/share";
import MdiImageSizeSelectActual from "~icons/mdi/image-size-select-actual";
import MdiImageSizeSelectSmall from "~icons/mdi/image-size-select-small";
import MdiImageSizeSelectLarge from "~icons/mdi/image-size-select-large";
import { i18n } from "@/locales";
import { useResizeObserver } from "@vueuse/core";
import { ref } from "vue";

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

const resizeRef = ref<HTMLElement>();

let mounted = false;

const reuseResizeObserver = () => {
  let init = true;
  return useResizeObserver(resizeRef, (entries) => {
    // Skip first call
    if (!mounted) {
      mounted = true;
      return;
    }
    if (init) {
      init = false;
      return;
    }
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    props.updateAttributes({ width: width + "px", height: height + "px" });
  });
};

let resizeObserver = reuseResizeObserver();

function handleSetSize(width: string, height: string) {
  resizeObserver.stop();
  props.updateAttributes({ width, height });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
  resizeObserver = reuseResizeObserver();
}

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
      :selected="selected"
      :editor="editor"
      :delete-node="deleteNode"
      :get-pos="getPos"
    >
      <template #content>
        <div v-if="!src" class="py-1.5">
          <input
            v-model.lazy="src"
            class="block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="i18n.global.t('editor.common.placeholder.link_input')"
            tabindex="-1"
            @focus="handleSetFocus"
          />
        </div>
        <div
          v-else
          ref="resizeRef"
          class="resize inline-block overflow-hidden text-center relative"
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

        <VDropdown class="inline-flex" :triggers="['click']" :distance="10">
          <BlockActionButton
            :tooltip="i18n.global.t('editor.extensions.image.edit_link')"
          >
            <template #icon>
              <MdiLinkVariant />
            </template>
          </BlockActionButton>

          <template #popper>
            <div
              class="relative rounded-md bg-white overflow-hidden drop-shadow w-96 p-1 max-h-72 overflow-y-auto"
            >
              <input
                v-model.lazy="src"
                :placeholder="
                  i18n.global.t('editor.common.placeholder.link_input')
                "
                class="bg-gray-50 rounded-md hover:bg-gray-100 block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </template>
        </VDropdown>

        <BlockActionButton
          :tooltip="i18n.global.t('editor.common.tooltip.open_link')"
          @click="handleOpenLink"
        >
          <template #icon>
            <MdiShare />
          </template>
        </BlockActionButton>
      </template>
    </block-card>
  </node-view-wrapper>
</template>
