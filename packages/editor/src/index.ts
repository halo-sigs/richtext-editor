import type { App, Plugin } from "vue";
import RichTextEditor from "./components/Editor.vue";
import "./styles/index.scss";
import "./styles/tailwind.css";
import "floating-vue/dist/style.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github-dark.css";

const plugin: Plugin = {
  install(app: App) {
    app.component("RichTextEditor", RichTextEditor);
  },
};

export default plugin;

export { RichTextEditor };

export * from "@tiptap/vue-3";
export * from "./extensions";
export * from "./components";
