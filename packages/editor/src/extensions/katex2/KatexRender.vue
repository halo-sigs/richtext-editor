<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import katex from "katex";
import "katex/dist/katex.css";

const props = defineProps(nodeViewProps);

const isBlock = props.node.type.name === "vueKatex2Block";

watch(
  () => props.node.attrs.content,
  (newVal) => {
    if (newVal) {
      props.updateAttributes({
        content: newVal,
      });
    }
  }
);

const renderedKatex = computed(() => {
  if (!props.node.attrs.content) {
    return "";
  }
  return katex.renderToString(props.node.attrs.content, {
    throwOnError: false,
    strict: false,
    displayMode: isBlock,
    maxSize: 300,
  });
});

const editMode = ref(false);
const textareaRef = ref(null);
const clickKatex = () => {
  props.editor.commands.setNodeSelection(props.getPos());
  editMode.value = true;
  nextTick(() => {
    textareaRef.value?.focus();
  });
};
</script>
<template>
  <node-view-wrapper
    :as="isBlock ? 'p' : 'span'"
    class="katex-render"
    contenteditable="false"
  >
    <component
      :is="isBlock ? 'p' : 'span'"
      @click="clickKatex"
      v-html="renderedKatex"
    />
    <textarea
      v-show="editMode"
      ref="textareaRef"
      v-model="node.attrs.content"
      @blur="() => (editMode = false)"
    ></textarea>
  </node-view-wrapper>
</template>
