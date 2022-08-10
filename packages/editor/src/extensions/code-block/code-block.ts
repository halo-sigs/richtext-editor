import { VueNodeViewRenderer } from "@tiptap/vue-3";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CodeBlockViewRenderer from "./CodeBlockViewRenderer.vue";

export default CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockViewRenderer);
  },
});
