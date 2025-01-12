import { readFile, writeFile } from "fs/promises"
import path from "path"
import { cwd } from "process"
import type { Config } from "@markdoc/markdoc"
import { Tag } from "@markdoc/markdoc"
import { describe, test } from "vitest"

import { transformDocument } from "../src"

const config: Config = {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          .filter((child: any) => child && child.name === "Tab")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          .map((tab: any) => (typeof tab === "object" ? tab?.attributes?.label : null))

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const defaultValue = node
          .transformChildren(config)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          .filter((child: any) => child && child.name === "Tab")

          // @ts-expect-error TODO: check how to fix the type issue
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          .find((tab: any) => tab?.attributes?.default == true)?.attributes?.label

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    skip: true,
  },
]

describe.each(tests)("$name", ({ name, skip }) => {
  test.skipIf(skip)(`${name}`, async () => {
    const input = await readFile(path.join(cwd(), `tests/testdata/${name}.input.md`), {
      encoding: "utf-8",
    })

    // const output = await readFile(path.join(cwd(), `tests/testdata/${name}.output.mdx`), {
    //   encoding: "utf-8",
    // })

    const generated = transformDocument({ document: input, config })

    await writeFile(
      path.join(cwd(), `tests/generated_data/${name}.generated.mdx`),
      generated?.rendered ?? "",
    )

    //expect(generated?.rendered).toEqual(output)
  })
})
