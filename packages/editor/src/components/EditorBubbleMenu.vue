<script lang="ts" setup>
import type { PropType } from "vue";
import type { Editor, AnyExtension } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/vue-3";
import type { NodeBubbleMenu } from "@/types";
import BubbleItem from "@/components/bubble/BubbleItem.vue";
import { defaultTextBubbleMenu } from "@/components/bubble/TextBubbleMenu";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const getBubbleMenuFromExtensions = () => {
  const extensionManager = props.editor?.extensionManager;
  return extensionManager.extensions
    .map((extension: AnyExtension) => {
      const { getBubbleMenu } = extension.options;

      if (!getBubbleMenu) {
        return null;
      }

      const nodeBubbleMenu = getBubbleMenu({
        editor: props.editor,
      }) as NodeBubbleMenu;

      return nodeBubbleMenu;
    })
    .concat([defaultTextBubbleMenu])
    .filter(Boolean) as NodeBubbleMenu[];
};
</script>
<template>
  <bubble-menu
    v-for="(bubbleMenu, index) in getBubbleMenuFromExtensions()"
    :key="index"
    :plugin-key="bubbleMenu?.pluginKey"
    :should-show="bubbleMenu?.shouldShow"
    :editor="editor"
    :tippy-options="{
      maxWidth: '100%',
      moveTransition: 'transform 0.2s ease-out',
      ...bubbleMenu.tippyOptions,
    }"
    :update-delay="bubbleMenu.updateDelay || 150"
  >
    <div
      class="bg-white flex items-center rounded p-1 border drop-shadow space-x-0.5"
    >
      <template v-if="bubbleMenu.items">
        <template
          v-for="(item, itemIndex) in bubbleMenu.items"
          :key="itemIndex"
        >
          <template v-if="item.component">
            <component
              :is="item.component"
              v-bind="item.props"
              :editor="editor"
            />
          </template>
          <bubble-item v-else :editor="editor" v-bind="item.props" />
        </template>
      </template>
      <template v-else-if="bubbleMenu.component">
        <component :is="bubbleMenu?.component" :editor="editor" />
      </template>
    </div>
  </bubble-menu>
</template>
