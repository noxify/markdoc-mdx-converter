import type { RenderableTreeNode } from "@markdoc/markdoc"

import { isTag } from "../helpers"
import { parseTag } from "../parse-tag"

export function generateParagraph({ children }: { children: RenderableTreeNode[] }) {
  return {
    type: "paragraph",
    children: children.map((ele) => {
      if (!isTag(ele)) {
        return { type: "text", value: ele }
      }

      return parseTag(ele)
    }),
  }
}
