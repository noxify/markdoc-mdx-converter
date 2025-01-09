import { readFile } from "fs/promises"
import path from "path"
import { cwd } from "process"
import { inspect } from "util"
import { Tag } from "@markdoc/markdoc"
import { fromMarkdown } from "mdast-util-from-markdown"
import { frontmatterFromMarkdown } from "mdast-util-frontmatter"
import { mdxFromMarkdown } from "mdast-util-mdx"
import { frontmatter } from "micromark-extension-frontmatter"
import { mdxjs } from "micromark-extension-mdxjs"
import { removePosition } from "unist-util-remove-position"
import * as vi from "vitest"

import { transformDocument } from "../dist"

const config = {
  tags: {
    callout: {
      render: "Callout",
      attributes: {
        title: {
          type: String,
          default: "default title",
        },
        type: {
          type: String,
          default: "default",
        },
      },
    },

    tabs: {
      render: "Tabs",
      children: ["Tab"],
      transform(node, config) {
        const labels = node
          .transformChildren(config)
          .filter((child: any) => child && child.name === "Tab")
          .map((tab: any) => (typeof tab === "object" ? tab?.attributes?.label : null))

        const defaultValue = node
          .transformChildren(config)
          .filter((child: any) => child && child.name === "Tab")
          .find((tab: any) => tab?.attributes?.default == true)?.attributes?.label

        return new Tag("div", { labels, defaultValue }, node.transformChildren(config))
      },
    },

    tab: {
      render: "Tab",
      attributes: {
        label: { type: String, required: true },
        default: { type: Boolean, required: false },
      },
    },

    accordion: {
      render: "Accordion",
      children: ["AccordionItem"],
      attributes: {
        type: { type: String },
        collapsible: { type: Boolean, required: false, default: false },
      },
    },

    accordionitem: {
      render: "AccordionItem",
      attributes: {
        title: { type: String, required: true },
      },
    },
  },
}

vi.test.skip("headings", async () => {
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

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test("accordion simple", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/accordion-simple.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/accordion-simple.output.mdx"))

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(outputTree, { depth: 10, colors: true }))
  //vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("accordion multiple", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/accordion.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/accordion.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("callout w/ title", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/callout-with-title.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/callout-with-title.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("callout w/o title", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/callout-without-title.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/callout-without-title.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("mermaid", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/mermaid.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/mermaid.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("railroad", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/railroad.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/railroad.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("table simple", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/table-simple.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/table-simple.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})

vi.test.skip("table complex", async () => {
  const input = await readFile(path.join(cwd(), "tests/testdata/table-complex.input.md"), {
    encoding: "utf-8",
  })
  const output = await readFile(path.join(cwd(), "tests/testdata/table-complex.output.mdx"))
  const config = {}

  const generated = transformDocument({ document: input, config })

  const outputTree = fromMarkdown(output, {
    extensions: [frontmatter({ type: "yaml", marker: "-" }), mdxjs()],
    mdastExtensions: [frontmatterFromMarkdown({ type: "yaml", marker: "-" }), mdxFromMarkdown()],
  })

  removePosition(outputTree, { force: true })

  console.log(inspect(generated?.transformedTree, { depth: 10, colors: true }))
  vi.expect(generated?.transformedTree ?? {}).toEqual(outputTree)
})
