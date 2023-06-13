import type { Editor } from "@tiptap/core";
import TiptapTaskList from "@tiptap/extension-task-list";
import type { TaskListOptions } from "@tiptap/extension-task-list";
import ExtensionTaskItem from "@tiptap/extension-task-item";
import ToolbarButton from "@/components/toolbar/ToolbarButton.vue";
import MdiFormatListCheckbox from "~icons/mdi/format-list-checkbox";
import { markRaw } from "vue";
import { i18n } from "@/locales";
import type { ExtensionOptions } from "@/types";

const TaskList = TiptapTaskList.extend<ExtensionOptions & TaskListOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      getToolbarItems({ editor }: { editor: Editor }) {
        return {
          priority: 150,
          component: ToolbarButton,
          props: {
            isActive: editor.isActive("taskList"),
            icon: markRaw(MdiFormatListCheckbox),
            title: i18n.global.t("editor.common.task_list"),
            action: () => editor.chain().focus().toggleTaskList().run(),
          },
        };
      },
    };
  },
  addExtensions() {
    return [ExtensionTaskItem];
  },
});

export default TaskList;
