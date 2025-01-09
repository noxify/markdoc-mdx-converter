---
title: Test document title
description: Some description
---

```railroad
Diagram(
  Optional('+', 'skip'),
  Choice(0,
    NonTerminal('name-start char'),
    NonTerminal('escape')
  ),
  ZeroOrMore(
    Choice(0,
      NonTerminal('name char'),
      NonTerminal('escape')
    )
  )
)
```