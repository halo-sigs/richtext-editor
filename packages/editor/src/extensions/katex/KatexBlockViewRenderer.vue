<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import katex from "katex";
import { computed, ref, watch } from "vue";

const props = defineProps(nodeViewProps);

const rawText = ref(props.node.attrs.content);

watch(
  () => rawText.value,
  (value) => {
    props.updateAttributes({
      content: value,
    });
  }
);

const renderedKatex = computed(() => {
  if (!rawText.value) {
    return "";
  }

  return katex.renderToString(rawText.value, {
    throwOnError: false,
    strict: false,
    displayMode: true,
    maxSize: 300,
  });
});
</script>
<template>
  <node-view-wrapper class="bg-gray-100 p-4">
    <div class="">
      <div class="">
        <button @click.prevent="deleteNode">Remove</button>
      </div>
      <textarea v-model="rawText" class="w-full" rows="3"></textarea>
      <div v-html="renderedKatex"></div>
    </div>
  </node-view-wrapper>
</template>
