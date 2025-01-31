import type { Tag } from "@markdoc/markdoc"
import type { ListItem } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateListItem(node: Tag, tagReplacer: TagReplacer): ListItem {
  return {
    type: "listItem",
    spread: false,
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return {
          type: "text",
          value: ele,
        }
      }

      return parseTagElement(ele, tagReplacer)
    }) as ListItem["children"],
  }
}
