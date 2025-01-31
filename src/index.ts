import type { Config, Tag } from "@markdoc/markdoc"
import type { Root, RootContent } from "mdast"
import Markdoc from "@markdoc/markdoc"
import { fromMarkdown } from "mdast-util-from-markdown"
import { frontmatterFromMarkdown, frontmatterToMarkdown } from "mdast-util-frontmatter"
import { mdxFromMarkdown, mdxToMarkdown } from "mdast-util-mdx"
import { toMarkdown } from "mdast-util-to-markdown"
import { frontmatter } from "micromark-extension-frontmatter"
import { mdxjs } from "micromark-extension-mdxjs"

import type { TagReplacer } from "./parser"
import {
  generateAccordion,
  generateAccordionItem,
  generateBlockquote,
  generateCallout,
  generateCodeblock,
  generateHeading,
  generateInlineCode,
  generateListItem,
  generateOrderedList,
  generateParagraph,
  generateTab,
  generateTable,
  generateTableBody,
  generateTableCell,
  generateTableHead,
  generateTableHeader,
  generateTableRow,
  generateTabs,
  generateUnorderedList,
} from "./generators"
import { tagParser } from "./parser"

export function mdxToAST(input: string) {
  return fromMarkdown(input, {
    extensions: [frontmatter(["yaml"]), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown(["yaml"]), mdxFromMarkdown()],
  })
}

/**
 * Converts Markdoc content to an AST (Abstract Syntax Tree) and rendered MDX
 *
 * @param content - The Markdoc content string to convert
 * @param markdocConfig - The Markdoc configuration object
 * @param replacer - An optional object containing custom tag replacers
 * @returns An object containing:
 *   - parsed: The AST root node containing the parsed content
 *   - rendered: The rendered MDX string, or null if parsing failed
 */
export function convertContent({
  content,
  markdocConfig,
  replacer,
}: {
  content: string
  markdocConfig: Config
  replacer?: Record<string, (node: Tag, tagReplacer: TagReplacer) => RootContent>
}) {
  const mdocAst = Markdoc.parse(content)
  const markdocTree = Markdoc.transform(mdocAst, markdocConfig)

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
    ...replacer,
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
