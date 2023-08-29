<script lang="ts" setup>
import { markRaw, type PropType } from "vue";
import type { Editor, AnyExtension } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/vue-3";
import type { NodeBubbleMenu } from "@/types";

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
    .filter(Boolean) as NodeBubbleMenu[];
};

const defaultTextBubbleMenu = {
  pluginKey: "textBubbleMenu",
  shouldShow: ({ editor }) => {
    const { selection } = editor.state;
    return !selection.empty;
  },
  component: markRaw(TextBubbleMenu),
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
    }"
  >
    <div
      class="bg-white flex items-center rounded p-1 border drop-shadow space-x-0.5"
    >
      <component :is="bubbleMenu?.component" :editor="editor" />
    </div>
  </bubble-menu>
</template>
