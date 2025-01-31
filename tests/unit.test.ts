import { readFile, writeFile } from "fs/promises"
import path from "path"
import { cwd } from "process"
import type { Config } from "@markdoc/markdoc"
import { describe, test } from "vitest"

import { mdxToAST, transformDocument } from "../src"
import { removePosition } from "../src/remove-position"

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
    skip: false,
  },
  {
    name: "accordion-simple",
    skip: false,
  },
  {
    name: "accordion-multiple",
    skip: false,
  },
  {
    name: "callout-with-title",
    skip: false,
  },
  {
    name: "callout-without-title",
    skip: false,
  },
  {
    name: "mermaid",
    skip: false,
  },
  {
    name: "railroad",
    skip: false,
  },
  {
    name: "table-simple",
    skip: false,
  },
  {
    name: "table-complex",
    skip: false,
  },
  {
    name: "tabs",
    skip: false,
  },
  {
    name: "codeblock",
    skip: false,
  },
  {
    name: "list",
    skip: false,
  },
  {
    name: "blockquote",
    skip: false,
  },
]

describe.each(tests.filter((test) => !test.skip))("$name", ({ name }) => {
  test(`${name}`, async () => {
    const input = await readFile(path.join(cwd(), `tests/testdata/${name}.input.md`), {
      encoding: "utf-8",
    })

    const output = await readFile(path.join(cwd(), `tests/testdata/${name}.output.mdx`), {
      encoding: "utf-8",
    })

    const outputAst = mdxToAST(output)

    removePosition(outputAst, new Set(["position"]))

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.output-ast.json`),
      JSON.stringify(outputAst, null, 2),
    )
    const generated = transformDocument({ document: input, config })

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.generated-ast.json`),
      JSON.stringify(generated.parsed, null, 2),
    )

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.generated.mdx`),
      generated.rendered ?? "",
    )

    //expect(generated?.rendered).toEqual(output)
  })
})
