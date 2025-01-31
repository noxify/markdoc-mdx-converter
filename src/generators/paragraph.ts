import type { Tag } from "@markdoc/markdoc"
import type { Paragraph } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateParagraph(node: Tag, tagReplacer: TagReplacer): Paragraph {
  return {
    type: "paragraph",
    children: node.children
      .map((ele) => {
        if (!isTag(ele)) {
          return { type: "text", value: ele as string }
        }

        return parseTagElement(ele, tagReplacer)
      })
      .filter((ele) => !!ele) as Paragraph["children"],
  }
}
