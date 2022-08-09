import type { Plugin, App } from "vue";
import Editor from "./components/Editor.vue";
import "./styles/tailwind.css";
import "floating-vue/dist/style.css";

const plugin: Plugin = {
  install(app: App) {
    app.component("RichTextEditor", Editor);
  },
};

export default plugin;

export { Editor };
