import type { Tag } from "@markdoc/markdoc"
import type { Link } from "mdast"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateLink(node: Tag, tagReplacer: TagReplacer): Link {
  return {
    type: "link",
    url: node.attributes.href as string,
    children: node.children
      .map((ele) => {
        if (!isTag(ele)) {
          return { type: "text", value: ele as string }
        }

        return parseTagElement(ele, tagReplacer)
      })
      .filter((ele) => !!ele) as Link["children"],
  }
}
