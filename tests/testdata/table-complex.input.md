---
title: Test document title
description: Some description
---

## Complex table w/o colspan

{% table %}
* Item
* In Stock
* Price
---
* Python Hat
* True
* 23.99
---
* SQL Hat
* True
* 13.99
---
* Codecademy Hat
* True
* 9.99
{% /table %}

## Complex table w/ colspan

{% table %}
* Item
* In Stock
* Price
---
* Python Hat
* True
* 23.99
---
* SQL Hat
* True
* 13.99
---
* Codecademy Hat
* Not in stock {% colspan=2 %}
{% /table %}

## Complex table w/ rich content ( maybe out of scope? )

{% table %}
* Item
* In Stock
* Price
---
* Python Hat
* - list element 1
  - list element 2
* 23.99
---
* SQL Hat
* True
* 13.99
---
* Codecademy Hat
* True
* 9.99
{% /table %}