---
description: 'Require empty lines around comments.'
---


This rule extends the base [`lines-around-comment`](/rules/js/lines-around-comment) rule.
It adds support for TypeScript syntax.

See the [ESLint documentation](https://eslint.org/docs/rules/lines-around-comment) for more details on the `lines-around-comment` rule.

## Options

In addition to the options supported by the `lines-around-comment` rule in ESLint core, the rule adds the following options:

- `allowEnumEnd: true` doesn't require a blank line after an enum body block end
- `allowEnumStart: true` doesn't require a blank line before an enum body block start
- `allowInterfaceEnd: true` doesn't require a blank line before an interface body block end
- `allowInterfaceStart: true` doesn't require a blank line after an interface body block start
- `allowModuleEnd: true` doesn't require a blank line before a module body block end
- `allowModuleStart: true` doesn't require a blank line after a module body block start
- `allowTypeEnd: true` doesn't require a blank line before a type literal block end
- `allowTypeStart: true` doesn't require a blank line after a type literal block start
