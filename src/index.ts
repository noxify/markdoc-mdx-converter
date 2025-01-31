import type { Config } from "@markdoc/markdoc"
import type { Root, RootContent } from "mdast"
import Markdoc from "@markdoc/markdoc"
import { fromMarkdown } from "mdast-util-from-markdown"
import { frontmatterFromMarkdown, frontmatterToMarkdown } from "mdast-util-frontmatter"
import { mdxFromMarkdown, mdxToMarkdown } from "mdast-util-mdx"
import { toMarkdown } from "mdast-util-to-markdown"
import { frontmatter } from "micromark-extension-frontmatter"
import { mdxjs } from "micromark-extension-mdxjs"

import {
  generateAccordion,
  generateAccordionItem,
  generateCallout,
  generateCodeblock,
  generateHeading,
  generateInlineCode,
  generateParagraph,
  generateTab,
  generateTabs,
} from "./generators"
import { generateBlockquote } from "./generators/blockquote"
import { generateListItem } from "./generators/li"
import { generateOrderedList } from "./generators/ol"
import { generateTable } from "./generators/table"
import { generateTableBody } from "./generators/tbody"
import { generateTableCell } from "./generators/td"
import { generateTableHead } from "./generators/th"
import { generateTableHeader } from "./generators/thead"
import { generateTableRow } from "./generators/tr"
import { generateUnorderedList } from "./generators/ul"
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
    Accordion: generateAccordion,
    AccordionItem: generateAccordionItem,
    Callout: generateCallout,
    code: generateInlineCode,
    pre: generateCodeblock,
    Tab: generateTab,
    Tabs: generateTabs,
    table: generateTable,
    thead: generateTableHeader,
    tbody: generateTableBody,
    tr: generateTableRow,
    td: generateTableCell,
    th: generateTableHead,
    ul: generateUnorderedList,
    ol: generateOrderedList,
    li: generateListItem,
    blockquote: generateBlockquote,
  }

  const parsed = tagParser(markdocTree, replacerConfig)

  if (parsed && frontmatter) {
    parsed.unshift({ type: "yaml", value: frontmatter })
  }
  const root = { type: "root", children: parsed } as Root

  return {
    parsed: root,

    rendered: parsed
      ? toMarkdown(root, { extensions: [frontmatterToMarkdown(["yaml"]), mdxToMarkdown()] })
      : null,
  }
}
