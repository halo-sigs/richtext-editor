<script lang="ts" setup>
import { Menu as VMenu } from "floating-vue";
import { Editor, type AnyExtension } from "@tiptap/vue-3";
import type { ToolbarItem } from "@/types";

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});

function getToolbarItemsFromExtensions() {
  const extensionManager = props.editor?.extensionManager;
  return extensionManager.extensions
    .reduce((acc: ToolbarItem[], extension: AnyExtension) => {
      const { getToolbarItems } = extension.options;

      if (!getToolbarItems) {
        return acc;
      }

      const items = getToolbarItems({
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
  <div
    class="editor-header flex items-center py-1 space-x-0.5 justify-center border-b drop-shadow-sm bg-white"
  >
    <div
      v-for="(item, index) in getToolbarItemsFromExtensions()"
      :key="index"
      class="inline-flex items-center justify-center"
    >
      <component
        :is="item.component"
        v-if="!item.children?.length"
        v-bind="item.props"
      />
      <VMenu v-else class="inline-flex">
        <button
          :class="{ 'bg-gray-200': item.props.isActive }"
          class="hover:bg-gray-100 p-1 rounded-sm"
        >
          <component :is="item.props.icon" />
        </button>
        <template #popper>
          <div
            class="relative rounded-md bg-white overflow-hidden drop-shadow w-48 p-1 max-h-72 overflow-y-auto"
          >
            <component
              v-bind="child.props"
              :is="child.component"
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
            />
          </div>
        </template>
      </VMenu>
    </div>
  </div>
</template>
