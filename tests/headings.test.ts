import { readFile } from "fs/promises"
import path from "path"
import { cwd } from "process"
import { inspect } from "util"
import { fromMarkdown } from "mdast-util-from-markdown"
import { frontmatterFromMarkdown } from "mdast-util-frontmatter"
import { mdxFromMarkdown } from "mdast-util-mdx"
import { frontmatter } from "micromark-extension-frontmatter"
import { mdxjs } from "micromark-extension-mdxjs"
import { removePosition } from "unist-util-remove-position"
import * as vi from "vitest"

import { transformDocument } from "../dist"

vi.test("headings", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/headings.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/headings.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated.transformedTree, { depth: 10, colors: true }))
  //console.log(inspect(outputTree, { depth: 10, colors: true }))
})
