import { lowlight } from "lowlight";
import "lowlight/lib/common";

// https://github.com/highlightjs/highlight.js/issues/3594
import xml from "highlight.js/lib/languages/xml";
lowlight.registerLanguage("html", xml);

export default lowlight;
