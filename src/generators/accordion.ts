import type { Tag } from "@markdoc/markdoc"
import type { MdxJsxFlowElement } from "mdast-util-mdx"

import { generateAttributes, isTag } from "../helpers"
import { parseAsTextElement, parseTag } from "../parse-tag"

export function generateAccordion({ node }: { node: Tag }): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: "Accordion",
    attributes: generateAttributes(node.attributes),
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return parseAsTextElement(ele)
      }

      return parseTag(ele)
    }),
  }
}
