import type { Tag } from "@markdoc/markdoc"
import type { Strong } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateStrong(node: Tag, tagReplacer: TagReplacer): Strong {
  return {
    type: "strong",
    children: node.children
      .map((ele) => {
        if (!isTag(ele)) {
          return {
            type: "text",
            value: ele,
          }
        }

        return parseTagElement(ele, tagReplacer)
      })
      .filter((ele) => !!ele) as Strong["children"],
  }
}
