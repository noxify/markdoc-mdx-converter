import type { Tag } from "@markdoc/markdoc"

import { isTag } from "../helpers"
import { parseTag } from "../parse-tag"

export function generateAccordionItem({ node }: { node: Tag }) {
  return {
    type: "mdxJsxFlowElement",
    name: "AccordionItem",
    attributes: Object.entries(node.attributes).map(([attributeName, attributeValue]) => {
      return { type: "mdxJsxAttribute", name: attributeName, value: attributeValue as unknown }
    }),
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return { type: "text", value: ele }
      }

      return parseTag(ele)
    }),
  }
}
