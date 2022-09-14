<script lang="ts" setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import lowlight from "./lowlight";
import { computed } from "vue";

const props = defineProps(nodeViewProps);

const languages = computed(() => {
  return lowlight.listLanguages();
});

const selectedLanguage = computed({
  get: () => {
    return props.node?.attrs.language;
  },
  set: (language: string) => {
    props.updateAttributes({ language: language });
  },
});
</script>
<template>
  <node-view-wrapper
    class="code-block divide-gray-100 bg-gray-100 rounded-sm overflow-hidden"
  >
    <div class="py-0.5 px-1">
      <select v-model="selectedLanguage" contenteditable="false">
        <option :value="null">auto</option>
        <option
          v-for="(language, index) in languages"
          :key="index"
          :value="language"
        >
          {{ language }}
        </option>
      </select>
    </div>
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>
