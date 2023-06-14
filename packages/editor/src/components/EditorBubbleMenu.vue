<script lang="ts" setup>
import { roundArrow } from "tippy.js";
import "tippy.js/dist/svg-arrow.css";
import type { PropType } from "vue";
import { BubbleMenu, Editor, type AnyExtension } from "@tiptap/vue-3";
import type { BubbleButton } from "@/types";
import EditorLinkBubbleMenuItems from "./EditorLinkBubbleMenuItems.vue";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

function getBubbleItemsFromExtensions() {
  const extensionManager = props.editor?.extensionManager;
  return extensionManager.extensions
    .reduce((acc: BubbleButton[], extension: AnyExtension) => {
      const { getBubbleItems } = extension.options;

      if (!getBubbleItems) {
        return acc;
      }

      const items = getBubbleItems({
        editor: props.editor,
      });

      if (Array.isArray(items)) {
        return [...acc, ...items];
      }

      return [...acc, items];
    }, [])
    .sort((a, b) => a.priority - b.priority);
}
</script>
<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100, arrow: roundArrow, maxWidth: '100%' }"
  >
    <div
      class="bg-white flex items-center rounded p-1 border drop-shadow space-x-0.5"
    >
      <component
        :is="item.component"
        v-for="(item, index) in getBubbleItemsFromExtensions()"
        :key="index"
        v-bind="item.props"
      />

      <div class="px-1">
        <div class="h-5 bg-gray-100" style="width: 1px"></div>
      </div>

      <EditorLinkBubbleMenuItems :editor="editor" />
    </div>
  </bubble-menu>
</template>
