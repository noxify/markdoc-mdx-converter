import type { MdxJsxAttribute, MdxJsxAttributeValueExpression } from "mdast-util-mdx"
import Markdoc from "@markdoc/markdoc"

export function isTag(ele?: unknown) {
  return !(ele === null || typeof ele !== "object" || !Markdoc.Tag.isTag(ele))
}

export function convertAttributeValue(value: unknown) {
  if (typeof value === "string") {
    return value
  }

  return { value } as MdxJsxAttributeValueExpression
}

export function generateAttributes(attributes: Record<string, unknown> = {}): MdxJsxAttribute[] {
  return Object.entries(attributes).map(([attributeName, attributeValue]) => {
    return {
      type: "mdxJsxAttribute",
      name: attributeName,
      value: convertAttributeValue(attributeValue),
    }
  })
}
