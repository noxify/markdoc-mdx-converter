import type { Tag } from "@markdoc/markdoc"
import type { Code } from "mdast"

export function generateCodeblock(node: Tag): Code {
  const lang = (node.attributes.lang ||
    node.attributes.language ||
    node.attributes["data-language"]) as string | undefined
  return {
    type: "code",
    lang,
    value: (node.children[0] ?? "") as string,
  }
}
