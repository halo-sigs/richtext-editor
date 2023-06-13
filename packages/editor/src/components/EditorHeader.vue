<script lang="ts" setup>
import { Menu as VMenu } from "floating-vue";
import { Editor, type AnyExtension } from "@tiptap/vue-3";
import type { ToolbarButton } from "@/types";

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});

function getToolbarItemsFromExtensions() {
  const extensionManager = props.editor?.extensionManager;
  return extensionManager.extensions
    .reduce((acc: ToolbarButton[], extension: AnyExtension) => {
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
      v-for="(spec, i) in getToolbarItemsFromExtensions()"
      :key="i"
      class="inline-flex items-center justify-center"
    >
      <component
        :is="spec.component"
        v-if="!spec.children?.length"
        v-bind="spec.props"
      />
      <VMenu v-else class="inline-flex">
        <button
          :class="{ 'bg-gray-200': spec.props.isActive }"
          class="hover:bg-gray-100 p-1 rounded-sm"
        >
          <component :is="spec.props.icon" />
        </button>
        <template #popper>
          <div
            class="relative rounded-md bg-white overflow-hidden drop-shadow w-48 p-1 max-h-72 overflow-y-auto"
          >
            <component
              v-bind="child.props"
              :is="child.component"
              v-for="(child, index) in spec.children"
              :key="index"
            />
          </div>
        </template>
      </VMenu>
    </div>
  </div>
</template>
