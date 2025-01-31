import type { Tag } from "@markdoc/markdoc"
import type { Blockquote } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateBlockquote(node: Tag, tagReplacer: TagReplacer): Blockquote {
  return {
    type: "blockquote",
    children: node.children
      .map((ele) => {
        if (!isTag(ele)) {
          return { type: "text", value: ele as string }
        }

        return parseTagElement(ele, tagReplacer)
      })
      .filter((ele) => !!ele) as Blockquote["children"],
  }
}
