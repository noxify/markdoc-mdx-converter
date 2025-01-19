import { inspect } from "util"
import type { Config, Tag } from "@markdoc/markdoc"
import type { Root, RootContent } from "mdast"
import Markdoc from "@markdoc/markdoc"
import { fromMarkdown } from "mdast-util-from-markdown"
import { frontmatterFromMarkdown, frontmatterToMarkdown } from "mdast-util-frontmatter"
import { mdxFromMarkdown } from "mdast-util-mdx"
import { toMarkdown } from "mdast-util-to-markdown"
import { frontmatter } from "micromark-extension-frontmatter"
import { mdxjs } from "micromark-extension-mdxjs"

import {
  generateCodeblock,
  generateHeading,
  generateInlineCode,
  generateParagraph,
  generateTab,
  generateTabs,
} from "./generators"
import { tagParser } from "./parser"

export function mdxToAST(input: string) {
  return fromMarkdown(input, {
    extensions: [frontmatter(["yaml"]), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown(["yaml"]), mdxFromMarkdown()],
  })
}

export function transformDocument({
  document,
  config,
}: {
  document: string
  config: Config
  targetFile?: string
}) {
  const mdocAst = Markdoc.parse(document)
  const markdocTree = Markdoc.transform(mdocAst, config)

  const frontmatter = mdocAst.attributes.frontmatter as string | null

  const output: RootContent[] = []

  if (frontmatter) {
    output.push({ type: "yaml", value: frontmatter })
  }

  const replacerConfig = {
    p: generateParagraph,
    h1: generateHeading,
    h2: generateHeading,
    h3: generateHeading,
    h4: generateHeading,
    h5: generateHeading,
    h6: generateHeading,
    code: generateInlineCode,
    pre: generateCodeblock,
    Tab: generateTab,
    Tabs: generateTabs,
  }

  const parsed = tagParser(markdocTree, replacerConfig)

  if (parsed && frontmatter) {
    parsed.unshift({ type: "yaml", value: frontmatter })
  }
  const root = { type: "root", children: parsed } as Root

  return {
    parsed,
    rendered: parsed ? toMarkdown(root, { extensions: [frontmatterToMarkdown(["yaml"])] }) : null,
  }
}
