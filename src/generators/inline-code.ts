import type { RenderableTreeNode } from "@markdoc/markdoc"

export function generateInlineCode({ children }: { children: RenderableTreeNode[] }) {
  return {
    type: "inlineCode",
    value: children[0],
  }
}
