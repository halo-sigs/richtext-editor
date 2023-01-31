<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed } from "vue";
import BlockCard from "@/components/block/BlockCard.vue";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockActionSeparator from "@/components/block/BlockActionSeparator.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiPlayCircle from "~icons/mdi/play-circle";
import MdiPlayCircleOutline from "~icons/mdi/play-circle-outline";
import MdiMotionPlayOutline from "~icons/mdi/motion-play-outline";
import MdiMotionPlay from "~icons/mdi/motion-play";

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
          <div class="py-1.5">
            <input
              v-model.lazy="src"
              class="block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入链接，按回车确定"
              tabindex="-1"
              @focus="handleSetFocus"
            />
          </div>
          <audio
            v-if="src"
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
          :tooltip="`${autoplay ? '关闭自动播放' : '开启自动播放'}`"
          @click="handleToggleAutoplay"
        >
          <template #icon>
            <MdiPlayCircle v-if="autoplay" />
            <MdiPlayCircleOutline v-else />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :selected="loop"
          :tooltip="`${loop ? '关闭循环播放' : '开启循环播放'}`"
          @click="handleToggleLoop"
        >
          <template #icon>
            <MdiMotionPlay v-if="loop" />
            <MdiMotionPlayOutline v-else />
          </template>
        </BlockActionButton>

        <BlockActionSeparator />

        <BlockActionButton tooltip="打开链接" @click="handleOpenLink">
          <template #icon>
            <MdiLinkVariant />
          </template>
        </BlockActionButton>
      </template>
    </block-card>
  </node-view-wrapper>
</template>
