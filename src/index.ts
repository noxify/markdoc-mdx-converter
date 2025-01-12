import type { Config, RenderableTreeNode } from "@markdoc/markdoc"
import type { Root } from "mdast"
import Markdoc, { Tag } from "@markdoc/markdoc"
import { frontmatterToMarkdown } from "mdast-util-frontmatter"
import { mdxToMarkdown } from "mdast-util-mdx"
import { toMarkdown } from "mdast-util-to-markdown"

function isTag(ele?: unknown) {
  return !(ele === null || typeof ele !== "object" || !Tag.isTag(ele))
}

function generateHeading({ level, children }: { level: number; children: RenderableTreeNode[] }) {
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

function generateParagraph({ children }: { children: RenderableTreeNode[] }) {
  return {
    type: "paragraph",
    children: children.map((ele) => {
      if (!isTag(ele)) {
        return { type: "text", value: ele }
      }

      return parseTag(ele)
    }),
  }
}

function generateInlineCode({ children }: { children: RenderableTreeNode[] }) {
  return {
    type: "inlineCode",
    value: children[0],
  }
}

function generateCodeblock({
  language,
  meta,
  children,
}: {
  language?: string
  meta?: Record<string, unknown>
  children: RenderableTreeNode[]
}) {
  return {
    type: "code",
    lang: language ?? null,
    meta: meta ?? null,
    value: children[0],
  }
}

function generateAccordion(node: Tag) {
  return {
    type: "mdxJsxFlowElement",
    name: "Accordion",
    attributes: Object.entries(node.attributes).map(([attributeName, attributeValue]) => {
      return { type: "mdxJsxAttribute", name: attributeName, value: attributeValue as unknown }
    }),
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return { type: "text", value: ele }
      }

      return parseTag(ele)
    }),
  }
}

function generateAccordionItem(node: Tag) {
  return {
    type: "mdxJsxFlowElement",
    name: "AccordionItem",
    attributes: Object.entries(node.attributes).map(([attributeName, attributeValue]) => {
      return { type: "mdxJsxAttribute", name: attributeName, value: attributeValue as unknown }
    }),
    children: node.children.map((ele) => {
      if (!isTag(ele)) {
        return { type: "text", value: ele }
      }

      return parseTag(ele)
    }),
  }
}

function parseTag(node: Tag): Record<string, unknown> {
  // console.log({ tagName: node })
  switch (node.name) {
    case "h1":
      return generateHeading({ level: 1, children: node.children })
    case "h2":
      return generateHeading({ level: 2, children: node.children })
    case "h3":
      return generateHeading({ level: 3, children: node.children })
    case "h4":
      return generateHeading({ level: 4, children: node.children })
    case "h5":
      return generateHeading({ level: 5, children: node.children })
    case "h6":
      return generateHeading({ level: 6, children: node.children })
    case "p":
      return generateParagraph({ children: node.children })

    case "code":
      return generateInlineCode({ children: node.children })
    case "pre":
      return generateCodeblock({
        language: node.attributes.lang as string | undefined,
        meta: node.attributes.meta as Record<string, unknown> | undefined,
        children: node.children,
      })

    case "Accordion":
      return generateAccordion(node)

    case "AccordionItem":
      return generateAccordionItem(node)
  }

  return {}
}

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
