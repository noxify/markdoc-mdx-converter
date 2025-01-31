import type { Tag } from "@markdoc/markdoc"
import type { List } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateUnorderedList(node: Tag, tagReplacer: TagReplacer): List {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return
      }

      return parseTagElement(ele, tagReplacer)
    }) as List["children"],
  }
}
