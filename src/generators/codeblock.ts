import type { RenderableTreeNode } from "@markdoc/markdoc"
import type { Code } from "mdast"

export function generateCodeblock({
  language,
  children,
}: {
  language?: string
  children: RenderableTreeNode[]
}): Code {
  return {
    type: "code",
    lang: language ?? null,
    value: (children[0] ?? "") as string,
  }
}
