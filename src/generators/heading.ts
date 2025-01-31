import type { Tag } from "@markdoc/markdoc"
import type { Heading } from "mdast"
import { createRegExp, digit, oneOrMore } from "magic-regexp"

import type { TagReplacer } from "../parser"
import { isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateHeading(node: Tag, tagReplacer: TagReplacer): Heading {
  const pattern = createRegExp(oneOrMore(digit).as("depthLevel"))
  const parsedName = node.name.match(pattern)

  const depth = parseInt(parsedName?.groups.depthLevel ?? "2") as Heading["depth"]

  return {
    type: "heading",
    depth,
    children: node.children.map((ele, index, arr) => {
      if (!isTag(ele)) {
        // not sure if this is required
        // but since we could have annotations in markdoc ( e.g. `{% #custom-heading-id %}` )
        // we have an additional space at the end, which would result in
        // `## Heading 2&#x20;` instead of `## Heading`
        if (index === arr.length - 1) {
          return {
            type: "text",
            value: (ele as string).trimEnd(),
          }
        }
        return {
          type: "text",
          value: ele as string,
        }
      }

      // since we could also have non-plain text in a heading ( e.g. some inline code )
      // we have to parse them, to get it rendered correctly
      return parseTagElement(ele, tagReplacer)
    }) as Heading["children"],
  }
}
