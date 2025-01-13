import type { RenderableTreeNode } from "@markdoc/markdoc"

export function generateCodeblock({
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
