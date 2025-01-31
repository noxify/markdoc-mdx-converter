# markdoc to MDX converter

A utility package to convert [Markdoc](https://markdoc.dev) documents to [MDX](https://mdxjs.com) format.

## Overview

This tool helps you migrate your existing documentation from Markdoc to MDX format.

## Important

While creating this converter, I needed a base to getting started.

I have used my old [markdoc template configuration](https://github.com/noxify/next-shadcn-markdoc/blob/main/config/markdoc.config.tsx) as base.

The generated code ( e.g. Custom Tags like `<Callout>` ) are based on my [renoun docs template](https://github.com/noxify/renoun-docs-template).

This means, if you're using other components, it's possible that this converter will not work out of the box for you.

If you have to customize or create your own converter functions, you can use the online editors from markdoc and mdx to see what you get as input and what is expected.

- Markdoc Editor: https://markdoc.dev/sandbox?mode=transform
- MDX Editor: https://mdxjs.com/playground/
  - Use `mdast (markdown)`
  - Use `remark-frontmatter` and `remark-gfm` as plugins

## Installation

```bash
# npm
npm install @noxify/markdoc-mdx-converter

# pnpm
pnpm add @noxify/markdoc-mdx-converter
```

## Usage

```ts
import { readFile, writeFile } from "fs/promises"
import path from "path"
import type { Config } from "@markdoc/markdoc"
import { convertContent } from "@noxify/markdoc-mdx-converter"

const sourceFile = path.join(cwd(), `content/source/file.md`)
const targetFile = path.join(cwd(), `content/target/file.mdx`)

const input = await readFile(sourceFile, {
  encoding: "utf-8",
})

// use your own markdoc config here
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

const generated = convertContent({ content: input, markdocConfig: config })

await writeFile(path.join(targetFile), generated.rendered ?? "")
```

## Supported generators

Currently this package has a definition for the following nodes/tags.

| Tag             | Function                |
| --------------- | ----------------------- |
| `p`             | `generateParagraph`     |
| `blockquote`    | `generateBlockquote`    |
| `h1`            | `generateHeading`       |
| `h2`            | `generateHeading`       |
| `h3`            | `generateHeading`       |
| `h4`            | `generateHeading`       |
| `h5`            | `generateHeading`       |
| `h6`            | `generateHeading`       |
| `code`          | `generateInlineCode`    |
| `pre`           | `generateCodeblock`     |
| `ul`            | `generateUnorderedList` |
| `ol`            | `generateOrderedList`   |
| `li`            | `generateListItem`      |
| `table`         | `generateTable`         |
| `thead`         | `generateTableHeader`   |
| `tbody`         | `generateTableBody`     |
| `tr`            | `generateTableRow`      |
| `th`            | `generateTableHead`     |
| `td`            | `generateTableCell`     |
| `Accordion`     | `generateAccordion`     |
| `AccordionItem` | `generateAccordionItem` |
| `Callout`       | `generateCallout`       |
| `Tabs`          | `generateTabs`          |
| `Tab`           | `generateTab`           |

Each function is available via

```ts
import { functionName } from "@noxify/markdoc-mdx-converter"
```

## Extending the converts

You can easily add new tag converters via

```ts
const customTagReplacer = {
  customTag: (node, tagReplacer) => {
    return {}
  },
}

const generated = convertContent({
  content: input,
  markdocConfig: config,
  tagReplacer: customTagReplacer,
})
```

To replace the default generators ( e.g. for `blockquote` ), you just have to use the tag name as key.

```ts
const customTagReplacer = {
  blockquote: (node, tagReplacer) => {
    // custom logic
    return {}
  },
}

const generated = convertContent({
  content: input,
  markdocConfig: config,
  tagReplacer: customTagReplacer,
})
```

## Examples / Testing

You can find a lot of examples in the `tests` directory.

The unit tests supports also a debug mode, which can be helpful when testing new converter functions.

If you activate the debug mode for one test, the test case will write the AST and the rendered AST to `tests/generated_data`.

## Contributing

If you miss something or have an idea to improve this package, feel free to open a PR with your changes.
