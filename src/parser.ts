import { inspect } from "util"
import type { RenderableTreeNode, Tag } from "@markdoc/markdoc"
import type { RootContent } from "mdast"

import { isTag } from "./helpers"

export type TagReplacer = Record<string, (node: Tag, tagReplacer: TagReplacer) => RootContent>

export function tagParser(
  markdocTree: RenderableTreeNode,
  tagReplacer: Record<string, (node: Tag, tagReplacer: TagReplacer) => RootContent>,
) {
  const result = []
  if (!isTag(markdocTree)) {
    return undefined
  }

  for (const node of markdocTree.children as Tag[]) {
    const parsedTag = parseTagElement(node, tagReplacer)

    if (parsedTag) {
      result.push(parsedTag)
    }
  }

  return result
}

export function parseTagElement(
  ele: Tag,
  tagReplacer: Record<string, (node: Tag, tagReplacer: TagReplacer) => RootContent>,
) {
  if (!tagReplacer[ele.name]) {
    // eslint-disable-next-line no-console
    console.warn(`No tag replacer found for: `, inspect(ele))
    return null
  }
  const parsedTag = tagReplacer[ele.name]?.(ele, tagReplacer)
  return parsedTag
}
