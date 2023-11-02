---
description: 'Require or disallow trailing commas.'
---


This rule extends the base [`comma-dangle`](/rules/js/comma-dangle) rule.
It adds support for TypeScript syntax.

See the [ESLint documentation](https://eslint.org/docs/rules/comma-dangle) for more details on the `comma-dangle` rule.

## Options

In addition to the options supported by the `comma-dangle` rule in ESLint core, the rule adds the following options:

- `"enums"` is for trailing comma in enum. (e.g. `enum Foo = {Bar,}`)
- `"generics"` is for trailing comma in generic. (e.g. `function foo<T,>() {}`)
- `"tuples"` is for trailing comma in tuple. (e.g. `type Foo = [string,]`)
