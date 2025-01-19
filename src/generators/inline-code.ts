import type { RenderableTreeNode } from "@markdoc/markdoc"
import type { InlineCode } from "mdast"

export function generateInlineCode({ children }: { children: RenderableTreeNode[] }): InlineCode {
  return {
    type: "inlineCode",
    value: (children[0] ?? "") as string,
  }
}
