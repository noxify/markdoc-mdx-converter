import type { Tag } from "@markdoc/markdoc"
import type { RootContent } from "mdast"

export function generateParagraph(node: Tag): RootContent {
  const paragraphDefinition: RootContent = {
    type: "paragraph",
    children: [
      {
        type: "text",
        value: node.children[0] as string,
      },
    ],
  }

  return paragraphDefinition
}
