<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import type { Item } from "./suggestion";

const props = defineProps({
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },

  command: {
    type: Function as PropType<(item: Item) => void>,
    required: true,
  },
});

const selectedIndex = ref(0);

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  }
);

function onKeyDown({ event }: { event: KeyboardEvent }) {
  if (event.key === "ArrowUp" || (event.key === "k" && event.ctrlKey)) {
    handleKeyUp();
    return true;
  }

  if (event.key === "ArrowDown" || (event.key === "j" && event.ctrlKey)) {
    handleKeyDown();
    return true;
  }

  if (event.key === "Enter") {
    handleKeyEnter();
    return true;
  }

  return false;
}

function handleKeyUp() {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length;
}

function handleKeyDown() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
}

function handleKeyEnter() {
  handleSelectItem(selectedIndex.value);
}

function handleSelectItem(index: number) {
  const item = props.items[index];

  if (item) {
    props.command(item);
  }
}

defineExpose({
  onKeyDown,
});
</script>
<template>
  <div class="items">
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'is-selected': index === selectedIndex }"
        class="item flex flex-row gap-5 items-center w-32 rounded"
        @click="handleSelectItem(index)"
      >
        <component :is="item.icon" class="bg-gray-100 p-0.5 rounded-sm" />
        {{ item.title }}
      </button>
    </template>
    <div v-else class="item">No result</div>
  </div>
</template>
<style>
.items {
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background: #fff;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
}

.item {
  margin: 0;
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;
}

.item.is-selected {
  border-color: #000;
}
</style>
