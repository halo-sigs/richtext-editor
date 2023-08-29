<script lang="ts" setup>
import { Editor, Node, NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import BlockActionButton from "@/components/block/BlockActionButton.vue";
import BlockCard from "@/components/block/BlockCard.vue";
import { i18n } from "@/locales";

defineProps<{
  editor: Editor;
  node: ProseMirrorNode;
  selected: boolean;
  extension: Node<any, any>;
  getPos: () => number;
  deleteNode: () => void;
}>();
</script>
<template>
  <node-view-wrapper>
    <block-card
      :editor="editor"
      :delete-node="deleteNode"
      :get-pos="getPos"
      :selected="selected"
    >
      <template #content>
        <node-view-content class="columns" />
      </template>
      <template #actions>
        <BlockActionButton
          :tooltip="
            i18n.global.t('editor.extensions.columns.add_column_before')
          "
          @click="editor.commands.addColBefore()"
        >
          <template #icon>
            <MdiImageSizeSelectSmall />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.columns.add_column_after')"
          @click="editor.commands.addColAfter()"
        >
          <template #icon>
            <MdiImageSizeSelectLarge />
          </template>
        </BlockActionButton>

        <BlockActionButton
          :tooltip="i18n.global.t('editor.extensions.columns.delete_column')"
          @click="editor.commands.deleteColumn()"
        >
          <template #icon>
            <MdiImageSizeSelectLarge />
          </template>
        </BlockActionButton>
      </template>
    </block-card>
  </node-view-wrapper>
</template>
<style>
.columns {
  display: flex;
  width: 100%;
  grid-gap: 8px;
  gap: 8px;
}
</style>
