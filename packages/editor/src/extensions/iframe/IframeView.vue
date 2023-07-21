<script lang="ts" setup>
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Decoration } from "prosemirror-view";
import { Editor, NodeViewWrapper, Node } from "@tiptap/vue-3";
import { computed, onMounted, ref } from "vue";
import { Dropdown as VDropdown } from "floating-vue";
import BlockCard from "@/components/block/BlockCard.vue";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockActionInput from "@/components/block/BlockActionInput.vue";
import BlockActionSeparator from "@/components/block/BlockActionSeparator.vue";
import MdiLinkVariant from "~icons/mdi/link-variant";
import MdiShare from "~icons/mdi/share";
import MdiCellphoneIphone from "~icons/mdi/cellphone-iphone";
import MdiTabletIpad from "~icons/mdi/tablet-ipad";
import MdiDesktopMac from "~icons/mdi/desktop-mac";
import MdiBorderAllVariant from "~icons/mdi/border-all-variant";
import MdiBorderNoneVariant from "~icons/mdi/border-none-variant";
import MdiFormatAlignLeft from "~icons/mdi/format-align-left";
import MdiFormatAlignCenter from "~icons/mdi/format-align-center";
import MdiFormatAlignRight from "~icons/mdi/format-align-right";
import MdiFormatAlignJustify from "~icons/mdi/format-align-justify";
import MdiWebSync from "~icons/mdi/web-sync";
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

const frameRef = ref();

function handleRefresh() {
  frameRef.value.src = src.value;
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
          class="inline-block overflow-hidden transition-all text-center relative h-full"
          :style="{
            width: node.attrs.width,
          }"
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
          <iframe
            v-else
            ref="frameRef"
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
          :tooltip="`${
            frameborder === '1'
              ? i18n.global.t('editor.extensions.iframe.disable_frameborder')
              : i18n.global.t('editor.extensions.iframe.enable_frameborder')
          }`"
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
          :tooltip="i18n.global.t('editor.common.tooltip.custom_width_input')"
        />

        <BlockActionInput
          v-model.lazy.trim="height"
          :tooltip="i18n.global.t('editor.common.tooltip.custom_height_input')"
        />

        <BlockActionSeparator />

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.iframe.phone_size')"
          :selected="sizeMatch('390px', '844px')"
          @click="handleSetSize('390px', '844px')"
        >
          <template #icon>
            <MdiCellphoneIphone />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="
            i18n.global.t('editor.extensions.iframe.tablet_vertical_size')
          "
          :selected="sizeMatch('834px', '1194px')"
          @click="handleSetSize('834px', '1194px')"
        >
          <template #icon>
            <MdiTabletIpad />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="
            i18n.global.t('editor.extensions.iframe.tablet_horizontal_size')
          "
          :selected="sizeMatch('1194px', '834px')"
          @click="handleSetSize('1194px', '834px')"
        >
          <template #icon>
            <MdiTabletIpad class="-rotate-90" />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.iframe.desktop_size')"
          :selected="sizeMatch('100%', '834px')"
          @click="handleSetSize('100%', '834px')"
        >
          <template #icon>
            <MdiDesktopMac />
          </template>
        </BlockActionButton>

        <BlockActionSeparator />

        <BlockActionButton
          :selected="editor.isActive({ textAlign: 'left' })"
          @click="editor.chain().focus().setTextAlign('left').run()"
        >
          <template #icon>
            <MdiFormatAlignLeft />
          </template>
        </BlockActionButton>
        <BlockActionButton
          :selected="editor.isActive({ textAlign: 'center' })"
          @click="editor.chain().focus().setTextAlign('center').run()"
        >
          <template #icon>
            <MdiFormatAlignCenter />
          </template>
        </BlockActionButton>
        <BlockActionButton
          :selected="editor.isActive({ textAlign: 'right' })"
          @click="editor.chain().focus().setTextAlign('right').run()"
        >
          <template #icon>
            <MdiFormatAlignRight />
          </template>
        </BlockActionButton>
        <BlockActionButton
          :selected="editor.isActive({ textAlign: 'justify' })"
          @click="editor.chain().focus().setTextAlign('justify').run()"
        >
          <template #icon>
            <MdiFormatAlignJustify />
          </template>
        </BlockActionButton>

        <BlockActionSeparator />

        <BlockActionButton
          :tooltip="i18n.global.t('editor.common.button.refresh')"
          @click="handleRefresh"
        >
          <template #icon>
            <MdiWebSync />
          </template>
        </BlockActionButton>

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
