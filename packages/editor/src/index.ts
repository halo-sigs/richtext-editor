import type { App, Plugin } from "vue";
import Editor from "./components/Editor.vue";
import "./styles/index.scss";
import "./styles/tailwind.css";
import "floating-vue/dist/style.css";
import "katex/dist/katex.css"

const plugin: Plugin = {
  install(app: App) {
    app.component("RichTextEditor", Editor);
  },
};

export default plugin;

export { Editor };
