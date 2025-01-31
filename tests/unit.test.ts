import { readFile, writeFile } from "fs/promises"
import path from "path"
import { cwd } from "process"
import type { Config } from "@markdoc/markdoc"
import { describe, expect, test } from "vitest"

import { convertContent } from "../src"

const config: Config = {
  nodes: {},
  tags: {
    callout: {
      render: "Callout",
      attributes: {
        title: {
          type: String,
        },
        type: {
          type: String,
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
    debug: false,
  },
  {
    name: "accordion-simple",
    debug: false,
  },
  {
    name: "accordion-multiple",
    debug: false,
  },
  {
    name: "callout-with-title",
    debug: false,
  },
  {
    name: "callout-without-title",
    debug: false,
  },
  {
    name: "mermaid",
    debug: false,
  },
  {
    name: "railroad",
    debug: false,
  },
  {
    name: "table-simple",
    debug: false,
  },
  {
    name: "table-complex",
    debug: false,
  },
  {
    name: "tabs",
    debug: false,
  },
  {
    name: "codeblock",
    debug: false,
  },
  {
    name: "list",
    debug: false,
  },
  {
    name: "blockquote",
    debug: false,
  },
]

describe.each(tests)("$name", ({ name, debug }) => {
  test.runIf(debug)(`DEBUG: ${name}`, async () => {
    const input = await readFile(path.join(cwd(), `tests/testdata/${name}.md`), {
      encoding: "utf-8",
    })

    const generated = convertContent({ content: input, markdocConfig: config })

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.generated-ast.json`),
      JSON.stringify(generated.parsed, null, 2),
    )

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.generated.mdx`),
      generated.rendered ?? "",
    )
  })

  test.runIf(!debug)(`${name}`, async () => {
    const input = await readFile(path.join(cwd(), `tests/testdata/${name}.md`), {
      encoding: "utf-8",
    })

    const generated = convertContent({ content: input, markdocConfig: config })

    expect(generated.parsed).toMatchSnapshot()
  })
})
