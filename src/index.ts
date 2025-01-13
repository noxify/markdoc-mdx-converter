import type { Config, Tag } from "@markdoc/markdoc"
import type { Root } from "mdast"
import Markdoc from "@markdoc/markdoc"
import { frontmatterToMarkdown } from "mdast-util-frontmatter"
import { mdxToMarkdown } from "mdast-util-mdx"
import { toMarkdown } from "mdast-util-to-markdown"

import { isTag } from "./helpers"
import { parseTag } from "./parse-tag"

export function transformDocument({
  document,
  config,
}: {
  document: string
  config: Config
  targetFile?: string
}): { transformedTree: Root; rendered: string } | null {
  const mdocAst = Markdoc.parse(document)
  const mdocTransformed = Markdoc.transform(mdocAst, config)

  const frontmatter = mdocAst.attributes.frontmatter as string | null

  const output = []

  if (frontmatter) {
    output.push({ type: "yaml", value: frontmatter })
  }

  if (!isTag(mdocTransformed)) {
    return null
  }

  for (const node of mdocTransformed.children) {
    if (!isTag(node)) {
      continue
    }
    output.push(parseTag(node))
  }

  const tree = {
    type: "root",
    children: output,
  } as unknown as Root

  return {
    transformedTree: tree,
    rendered: toMarkdown(tree, { extensions: [frontmatterToMarkdown("yaml"), mdxToMarkdown()] }),
  }
}
