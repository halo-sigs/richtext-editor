<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import katex from "katex";
import "katex/dist/katex.css";

const props = defineProps(nodeViewProps);

const isBlock = props.node.type.name === "vueKatex2Block";

const renderedKatex = computed(() => {
  if (!props.node.attrs.content) {
    return "";
  }
  return katex.renderToString(props.node.attrs.content.toString(), {
    throwOnError: false,
    strict: false,
    displayMode: isBlock,
    maxSize: 300,
  });
});

watch(
  () => props.node.attrs.editMode,
  (value) => {
    if (value) {
      nextTick(() => {
        textareaRef.value?.focus();
      });
    }
  },
  {
    immediate: true,
  }
);

const textareaRef = ref(null);

const clickKatex = () => {
  props.editor.commands.setNodeSelection(props.getPos());
  updateEditProperties(true);
};

function updateEditProperties(editMode: boolean) {
  props.updateAttributes({
    editMode: editMode,
  });
}
</script>
<template>
  <node-view-wrapper
    class="katex-render"
    :as="isBlock ? 'div' : 'span'"
    contenteditable="false"
    :class="{ 'katex-render-selected': props.selected }"
  >
    <span class="katex-render-wrapper">
      <component
        :is="isBlock ? 'p' : 'span'"
        class="katex-render-content"
        @click="clickKatex"
        v-html="renderedKatex"
      />
      <textarea
        v-show="node.attrs.editMode"
        ref="textareaRef"
        v-model="node.attrs.content"
        class="katex-editor-content"
        placeholder="Enter LaTeX formula"
        @blur="() => updateEditProperties(false)"
      ></textarea>
    </span>
  </node-view-wrapper>
</template>
