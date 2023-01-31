<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed } from "vue";
import BlockCard from "@/components/block/BlockCard.vue";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockActionInput from "@/components/block/BlockActionInput.vue";
import BlockActionSeparator from "@/components/block/BlockActionSeparator.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiCellphoneIphone from "~icons/mdi/cellphone-iphone";
import MdiTabletIpad from "~icons/mdi/tablet-ipad";
import MdiDesktopMac from "~icons/mdi/desktop-mac";
import MdiBorderAllVariant from "~icons/mdi/border-all-variant";
import MdiBorderNoneVariant from "~icons/mdi/border-none-variant";

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

const width = computed({
  get: () => {
    return props.node.attrs.width;
  },
  set: (value: string) => {
    handleSetSize(value, height.value);
  },
});

const height = computed({
  get: () => {
    return props.node.attrs.height;
  },
  set: (value: string) => {
    handleSetSize(width.value, value);
  },
});

const frameborder = computed(() => {
  return props.node.attrs.frameborder;
});

function handleSetFocus() {
  props.editor.commands.setNodeSelection(props.getPos());
}

function handleSetSize(width: string, height: string) {
  props.updateAttributes({ width, height });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
}

function handleToggleFrameborder() {
  props.updateAttributes({
    frameborder: props.node.attrs.frameborder === "0" ? "1" : "0",
  });
  props.editor.chain().focus().setNodeSelection(props.getPos()).run();
}

function sizeMatch(width: string, height: string) {
  return width === props.node.attrs.width && height === props.node.attrs.height;
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
          class="inline-block overflow-hidden transition-all text-center relative h-full"
          :style="{
            width: node.attrs.width,
          }"
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
          <iframe
            v-if="src"
            class="rounded-md"
            :src="node!.attrs.src"
            :width="node.attrs.width"
            :height="node.attrs.height"
            scrolling="yes"
            :frameborder="frameborder"
            framespacing="0"
            allowfullscreen="true"
            :class="{
              'border-2': frameborder === '1',
            }"
            @mouseenter="handleSetFocus"
          ></iframe>
        </div>
      </template>
      <template #actions>
        <BlockActionButton
          :selected="frameborder === '1'"
          :tooltip="`${frameborder === '1' ? '取消边框' : '设置边框'}`"
          @click="handleToggleFrameborder"
        >
          <template #icon>
            <MdiBorderAllVariant v-if="frameborder === '1'" />
            <MdiBorderNoneVariant v-else />
          </template>
        </BlockActionButton>

        <BlockActionSeparator />

        <BlockActionInput
          v-model.lazy.trim="width"
          tooltip="自定义宽度，按回车键生效"
        />

        <BlockActionInput
          v-model.lazy.trim="height"
          tooltip="自定义高度，按回车键生效"
        />

        <BlockActionSeparator />

        <BlockActionButton
          tooltip="手机尺寸"
          :selected="sizeMatch('390px', '844px')"
          @click="handleSetSize('390px', '844px')"
        >
          <template #icon>
            <MdiCellphoneIphone />
          </template>
        </BlockActionButton>

        <BlockActionButton
          tooltip="平板电脑纵向尺寸"
          :selected="sizeMatch('834px', '1194px')"
          @click="handleSetSize('834px', '1194px')"
        >
          <template #icon>
            <MdiTabletIpad />
          </template>
        </BlockActionButton>

        <BlockActionButton
          tooltip="平板电脑横向尺寸"
          :selected="sizeMatch('1194px', '834px')"
          @click="handleSetSize('1194px', '834px')"
        >
          <template #icon>
            <MdiTabletIpad class="-rotate-90" />
          </template>
        </BlockActionButton>

        <BlockActionButton
          tooltip="桌面电脑尺寸"
          :selected="sizeMatch('100%', '834px')"
          @click="handleSetSize('100%', '834px')"
        >
          <template #icon>
            <MdiDesktopMac />
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
