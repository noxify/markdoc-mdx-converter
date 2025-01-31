import type { Tag } from "@markdoc/markdoc"
import type { MdxJsxFlowElement } from "mdast-util-mdx"

import type { TagReplacer } from "../parser"
import { generateAttributes, isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateTab(node: Tag, tagReplacer: TagReplacer): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: "TabsContent",
    attributes: generateAttributes(node.attributes).map((ele) => {
      if (ele.name === "label") {
        return {
          ...ele,
          name: "value",
        }
      }

      return ele
    }),
    children: node.children
      .map((ele) => {
        if (!isTag(ele)) {
          return {
            type: "text",
            value: (ele as string).trimEnd(),
          }
        }

        return parseTagElement(ele, tagReplacer)
      })
      .filter((ele) => !!ele) as MdxJsxFlowElement["children"],
  }
}
