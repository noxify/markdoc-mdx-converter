import type { Tag } from "@markdoc/markdoc"
import type { BlockContent, DefinitionContent, RootContent } from "mdast"

import type { TagReplacer } from "../parser"
import { generateAttributes, isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateAccordion(node: Tag, tagReplacer: TagReplacer): RootContent {
  return {
    type: "mdxJsxFlowElement",
    name: "Accordion",
    attributes: generateAttributes(node.attributes),
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return {
          type: "text",
          value: (ele as string).trimEnd(),
        }
      }

      return parseTagElement(ele, tagReplacer)
    }) as (BlockContent | DefinitionContent)[],
  }
}
