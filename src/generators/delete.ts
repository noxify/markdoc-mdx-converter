import type { Tag } from "@markdoc/markdoc"
import type { Delete } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateDelete(node: Tag, tagReplacer: TagReplacer): Delete {
  return {
    type: "delete",
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
      .filter((ele) => !!ele) as Delete["children"],
  }
}
