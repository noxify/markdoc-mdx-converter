import type { Tag } from "@markdoc/markdoc"
import type { RootContent } from "mdast"
import type { MdxJsxFlowElement } from "mdast-util-mdx"

import type { TagReplacer } from "../parser"
import { generateAttributes, isTag } from "../helpers"
import { parseTagElement } from "../parser"

export function generateTabs(node: Tag, tagReplacer: TagReplacer): RootContent {
  const tabElements: MdxJsxFlowElement[] = node.children
    .map((ele) => {
      if (!isTag(ele)) {
        return null
      }

      return parseTagElement(ele, tagReplacer) as MdxJsxFlowElement
    })
    .filter((ele) => !!ele)

  const defaultTab = tabElements
    .find((tabElement) =>
      tabElement.attributes.find((ele) => ele.type === "mdxJsxAttribute" && ele.name === "default"),
    )
    ?.attributes.find((ele) => ele.type === "mdxJsxAttribute" && ele.name === "value")?.value as
    | string
    | undefined

  const tabTriggers = tabElements
    .filter((ele) => ele.name === "TabsContent")
    .flatMap(
      (ele) =>
        ele.attributes.find((ele) => ele.type === "mdxJsxAttribute" && ele.name === "value")?.value,
    )
    .filter((ele) => !!ele) as string[]

  const tabsList = {
    type: "mdxJsxFlowElement",
    name: "TabsList",
    attributes: [],
    children: [
      {
        type: "paragraph",
        children: tabTriggers.flatMap((ele, index) => {
          return [
            {
              type: "mdxJsxTextElement",
              name: "TabsTrigger",
              attributes: generateAttributes({ value: ele }),
              children: [{ type: "text", value: ele }],
            },
            index < tabTriggers.length - 1 ? { type: "text", value: "\n" } : null,
          ].filter((ele) => !!ele)
        }),
      },
    ],
  } as MdxJsxFlowElement

  const res = {
    type: "mdxJsxFlowElement",
    name: "Tabs",
    attributes: generateAttributes({
      ...node.attributes,
      ...(defaultTab ? { defaultValue: defaultTab } : {}),
    }),
    children: [tabsList, ...tabElements],
  } as MdxJsxFlowElement

  return res
}
