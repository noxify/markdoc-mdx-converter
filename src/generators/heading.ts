import type { RenderableTreeNode } from "@markdoc/markdoc"

import { isTag } from "../helpers"
import { parseTag } from "../parse-tag"

export function generateHeading({
  level,
  children,
}: {
  level: number
  children: RenderableTreeNode[]
}) {
  return {
    type: "heading",
    depth: level,
    children: children.map((ele, index, arr) => {
      if (!isTag(ele)) {
        // not sure if this is required
        // but since we could have annotations in markdoc ( e.g. `{% #custom-heading-id %}` )
        // we have an additional space at the end, which would result in
        // `## Heading 2&#x20;` instead of `## Heading`
        if (index === arr.length - 1) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          return { type: "text", value: ele?.toString().trimEnd() }
        }
        return { type: "text", value: ele }
      }

      return parseTag(ele)
    }),
  }
}
