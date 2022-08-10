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
  <node-view-wrapper class="code-block relative">
    <select
      v-model="selectedLanguage"
      class="right-1 top-1 absolute"
      contenteditable="false"
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
    <pre><node-view-content as="code" /></pre>
  </node-view-wrapper>
</template>
