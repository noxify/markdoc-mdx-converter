import { readFile, writeFile } from "fs/promises"
import path from "path"
import { cwd } from "process"
import { inspect } from "util"
import type { Config } from "@markdoc/markdoc"
import Markdoc, { Tag } from "@markdoc/markdoc"
import { describe, test } from "vitest"

import { mdxToAST, transformDocument } from "../src"

const config: Config = {
  nodes: {},
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
        collapsible: { type: Boolean, required: false },
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

const tests = [
  {
    name: "headings",
    skip: false,
  },
  {
    name: "accordion-simple",
    skip: true,
  },
  {
    name: "accordion-multiple",
    skip: true,
  },
  {
    name: "callout-with-title",
    skip: true,
  },
  {
    name: "callout-without-title",
    skip: true,
  },
  {
    name: "mermaid",
    skip: true,
  },
  {
    name: "railroad",
    skip: true,
  },
  {
    name: "table-simple",
    skip: true,
  },
  {
    name: "table-complex",
    skip: true,
  },
  {
    name: "tabs",
    skip: false,
  },

  {
    name: "codeblock",
    skip: false,
  },
]

describe.each(tests.filter((test) => !test.skip))("$name", ({ name, skip }) => {
  test(`${name}`, async () => {
    const input = await readFile(path.join(cwd(), `tests/testdata/${name}.input.md`), {
      encoding: "utf-8",
    })

    const output = await readFile(path.join(cwd(), `tests/testdata/${name}.output.mdx`), {
      encoding: "utf-8",
    })

    const generated = transformDocument({ document: input, config })

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.generated.mdx`),
      generated.rendered ?? "",
    )

    //expect(generated?.rendered).toEqual(output)
  })
})
