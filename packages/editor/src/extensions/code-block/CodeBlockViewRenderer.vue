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
    class="code-block divide-gray-100 bg-gray-100 overflow-hidden rounded-md"
  >
    <div class="px-2 py-1.5">
      <select
        v-model="selectedLanguage"
        contenteditable="false"
        class="block px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      >
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
