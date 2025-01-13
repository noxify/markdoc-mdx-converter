import type { Tag } from "@markdoc/markdoc"

import * as generators from "./generators"

export function parseTag(node: Tag): Record<string, unknown> {
  switch (node.name) {
    case "h1":
      return generators.generateHeading({ level: 1, children: node.children })
    case "h2":
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
        language: node.attributes.lang as string | undefined,
        meta: node.attributes.meta as Record<string, unknown> | undefined,
        children: node.children,
      })

    case "Accordion":
      return generators.generateAccordion({ node })

    case "AccordionItem":
      return generators.generateAccordionItem({ node })
  }

  return {}
}
