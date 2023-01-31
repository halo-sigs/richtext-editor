<script lang="ts" setup>
import type { Editor } from "@tiptap/vue-3";
import { Dropdown as VDropdown } from "floating-vue";
import { computed, ref } from "vue";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";
import BlockActionSeparator from "./BlockActionSeparator.vue";
import BlockActionButton from "./BlockActionButton.vue";

const props = withDefaults(
  defineProps<{
    selected: boolean;
    editor: Editor;
    getPos: () => number;
    deleteNode: () => void;
  }>(),
  {
    selected: false,
  }
);

const hover = ref(false);

const dropdownVisible = computed(() => {
  return hover.value || props.selected;
});

function handleInsertNewLine() {
  props.editor.commands.insertContentAt(
    props.getPos() + 1,
    [{ type: "paragraph", content: "" }],
    {
      updateSelection: true,
    }
  );
  props.editor.commands.focus(props.getPos() + 2, {
    scrollIntoView: true,
  });
}
</script>

<template>
  <section
    class="editor-block"
    :class="{ 'editor-block--selected': selected }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <VDropdown
      placement="bottom-end"
      :shown="dropdownVisible"
      :auto-hide="false"
      :triggers="[]"
      :distance="8"
      theme="editor-block-dropdown"
    >
      <div class="editor-block__content">
        <slot name="content" />
      </div>
      <template #popper>
        <div class="editor-block__actions">
          <slot name="actions" />

          <BlockActionButton tooltip="换行" @click="handleInsertNewLine">
            <template #icon>
              <MdiArrowULeftBottom />
            </template>
          </BlockActionButton>

          <BlockActionSeparator />

          <BlockActionButton tooltip="删除" @click="deleteNode">
            <template #icon>
              <MdiDeleteForeverOutline />
            </template>
          </BlockActionButton>
        </div>
      </template>
    </VDropdown>
  </section>
</template>

<style lang="scss">
.editor-block {
  @apply relative;

  &__content {
    @apply transition-all
    rounded
    p-2;
  }

  &__actions {
    @apply p-1 flex flex-row gap-0.5 items-center;
  }

  &:hover & {
    &__content {
      @apply bg-gray-50;
    }
  }

  &--selected & {
    &__content {
      @apply bg-gray-50;
    }
  }
}
</style>
