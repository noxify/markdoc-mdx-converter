import { Tag } from "@markdoc/markdoc"

export function isTag(ele?: unknown) {
  return !(ele === null || typeof ele !== "object" || !Tag.isTag(ele))
}
