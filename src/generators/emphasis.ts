import type { Tag } from "@markdoc/markdoc"
import type { Emphasis } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateEmphasis(node: Tag, tagReplacer: TagReplacer): Emphasis {
  return {
    type: "emphasis",
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
      .filter((ele) => !!ele) as Emphasis["children"],
  }
}
