import type { Tag } from "@markdoc/markdoc"
import type { PhrasingContent, RootContent } from "mdast"
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx"

import * as generators from "./generators"

export function parseAsTextElement(value: unknown) {
  return {
    type: "text",
    value: value as string,
  }
}

export function parseTag(
  node: Tag,
): RootContent | PhrasingContent | undefined | MdxJsxFlowElement | MdxJsxTextElement {
  switch (node.name) {
    case "h1":
      return generators.generateHeading({ level: 1, children: node.children })
    case "h2":
      console.log({ node })
      return generators.generateHeading({ level: 2, children: node.children })
    case "h3":
      return generators.generateHeading({ level: 3, children: node.children })
    case "h4":
      return generators.generateHeading({ level: 4, children: node.children })
    case "h5":
      return generators.generateHeading({ level: 5, children: node.children })
    case "h6":
      return generators.generateHeading({ level: 6, children: node.children })
    case "p":
      return generators.generateParagraph({ children: node.children })

    case "code":
      return generators.generateInlineCode({ children: node.children })
    case "pre":
      return generators.generateCodeblock({
        language: (node.attributes.lang ||
          node.attributes.language ||
          node.attributes["data-language"]) as string | undefined,
        children: node.children,
      })

    // case "Accordion":
    //   return generators.generateAccordion({ node })

    // case "AccordionItem":
    //   return generators.generateAccordionItem({ node })

    // case "Callout":
    //   return generators.generateCallout({ node })

    case "Tabs":
      return generators.generateTabs({ node })

    case "Tab":
      return generators.generateTab({ node })
  }
}
