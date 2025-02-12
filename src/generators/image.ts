import type { Tag } from "@markdoc/markdoc"
import type { Image } from "mdast"

export function generateImage(node: Tag): Image {
  return {
    type: "image",

    url: node.attributes.src as string,
    alt: node.attributes.alt as string | null,
  }
}
