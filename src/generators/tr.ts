import type { Tag } from "@markdoc/markdoc"
import type { MdxJsxFlowElement } from "mdast-util-mdx"

import type { TagReplacer } from "../parser"
import { generateAttributes, isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateTableRow(node: Tag, tagReplacer: TagReplacer): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: "TableRow",
    attributes: generateAttributes(node.attributes),
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return
      }

      return parseTagElement(ele, tagReplacer)
    }) as MdxJsxFlowElement["children"],
  }
}
