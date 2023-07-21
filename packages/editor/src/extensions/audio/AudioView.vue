<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed, onMounted, ref } from "vue";
import { Dropdown as VDropdown } from "floating-vue";
import BlockCard from "@/components/block/BlockCard.vue";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockActionSeparator from "@/components/block/BlockActionSeparator.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiShare from "~icons/mdi/share";
import MdiPlayCircle from "~icons/mdi/play-circle";
import MdiPlayCircleOutline from "~icons/mdi/play-circle-outline";
import MdiMotionPlayOutline from "~icons/mdi/motion-play-outline";
import MdiMotionPlay from "~icons/mdi/motion-play";
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

const src = computed({
  get: () => {
    return props.node?.attrs.src;
  },
  set: (src: string) => {
    props.updateAttributes({ src: src });
  },
});

const autoplay = computed(() => {
  return props.node.attrs.autoplay;
});

const loop = computed(() => {
  return props.node.attrs.loop;
});

function handleSetFocus() {
  props.editor.commands.setNodeSelection(props.getPos());
}

function handleToggleAutoplay() {
  props.updateAttributes({
    autoplay: props.node.attrs.autoplay ? null : true,
  });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
}

function handleToggleLoop() {
  props.updateAttributes({
    loop: props.node.attrs.loop ? null : true,
  });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
}

function handleOpenLink() {
  window.open(src.value, "_blank");
}

const inputRef = ref();

onMounted(() => {
  if (!src.value) {
    inputRef.value.focus();
  }
});
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
        <div
          class="inline-block overflow-hidden transition-all text-center relative h-full w-full"
        >
          <div v-if="!src" class="p-1.5">
            <input
              ref="inputRef"
              v-model.lazy="src"
              class="block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              :placeholder="
                i18n.global.t('editor.common.placeholder.link_input')
              "
              tabindex="-1"
              @focus="handleSetFocus"
            />
          </div>
          <audio
            v-else
            controls
            :autoplay="autoplay"
            :loop="loop"
            :src="node!.attrs.src"
            @mouseenter="handleSetFocus"
          ></audio>
        </div>
      </template>
      <template #actions>
        <BlockActionButton
          :selected="autoplay"
          :tooltip="`${
            autoplay
              ? i18n.global.t('editor.extensions.audio.disable_autoplay')
              : i18n.global.t('editor.extensions.audio.enable_autoplay')
          }`"
          @click="handleToggleAutoplay"
        >
          <template #icon>
            <MdiPlayCircle v-if="autoplay" />
            <MdiPlayCircleOutline v-else />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :selected="loop"
          :tooltip="`${
            loop
              ? i18n.global.t('editor.extensions.audio.disable_loop')
              : i18n.global.t('editor.extensions.audio.enable_loop')
          }`"
          @click="handleToggleLoop"
        >
          <template #icon>
            <MdiMotionPlay v-if="loop" />
            <MdiMotionPlayOutline v-else />
          </template>
        </BlockActionButton>

        <BlockActionSeparator />

        <VDropdown class="inline-flex" :triggers="['click']" :distance="10">
          <BlockActionButton
            :tooltip="i18n.global.t('editor.common.button.edit_link')"
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
