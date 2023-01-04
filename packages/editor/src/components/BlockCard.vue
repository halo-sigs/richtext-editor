<script lang="ts" setup>
import type { Editor } from "@tiptap/vue-3";
import { Dropdown as VDropdown, VTooltip } from "floating-vue";
import { computed, ref } from "vue";
import MdiDeleteForeverOutline from "~icons/mdi/delete-forever-outline?color=red";
import MdiArrowULeftBottom from "~icons/mdi/arrow-u-left-bottom";

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
      placement="top-end"
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
        <div class="editor-block__dropdown">
          <slot name="dropdownItems" />

          <div
            v-tooltip="'换行'"
            class="editor-block__dropdown-item"
            @click="handleInsertNewLine()"
          >
            <MdiArrowULeftBottom />
          </div>

          <div class="editor-block__dropdown-separator"></div>

          <div
            v-tooltip="'删除'"
            class="editor-block__dropdown-item"
            @click="deleteNode()"
          >
            <MdiDeleteForeverOutline />
          </div>
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

  &__dropdown {
    @apply p-1 flex flex-row gap-0.5 items-center;
    &-item {
      @apply p-1.5 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100;

      &--selected {
        @apply bg-gray-200;
      }
    }

    &-separator {
      @apply h-5 bg-gray-100 mx-1.5;
      width: 1px;
    }
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
