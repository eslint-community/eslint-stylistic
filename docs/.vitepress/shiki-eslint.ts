import { createPositionConverter } from 'shiki'
import type { ShikiTransformer } from 'shiki'
import type { ESLint } from 'eslint'
import { Linter } from 'eslint'
import stylistic from '@stylistic/eslint-plugin'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import stylisticPlus from '@stylistic/eslint-plugin-plus'
import * as parserTs from '@typescript-eslint/parser'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import type { TwoslashFunction, TwoslashShikiReturn } from '@shikijs/twoslash'
import { resolveNodePositions } from 'twoslash'
import type { NodeErrorWithoutPosition } from 'twoslash'

const eslintConfig: Linter.FlatConfig[] = [
  {
    files: ['**'],
    plugins: {
      '@stylistic': stylistic as ESLint.Plugin,
      '@stylistic/js': stylisticJs as ESLint.Plugin,
      '@stylistic/jsx': stylisticJsx as ESLint.Plugin,
      '@stylistic/ts': stylisticTs as ESLint.Plugin,
      '@stylistic/plus': stylisticPlus as ESLint.Plugin,
    },
    languageOptions: {
      parser: parserTs as Linter.ParserModule,
    },
  },
]

const linter = new Linter({ configType: 'flat' })
const twoslashESLint: TwoslashFunction = (code, ext) => {
  const filename = `file.${ext ?? 'ts'}`
  const messages = linter.verify(
    // Remove trailing newline and presentational `⏎` characters
    code.replace(/⏎(?=\n)/gu, '').replace(/⏎$/gu, '\n'),
    eslintConfig,
    { filename },
  )

  const pc = createPositionConverter(code)
  const raws: NodeErrorWithoutPosition[] = messages.map((message): NodeErrorWithoutPosition => {
    const start = pc.posToIndex(message.line - 1, message.column - 1)
    const end = message.endLine != null && message.endColumn != null
      ? pc.posToIndex(message.endLine - 1, message.endColumn - 1)
      : start + 1

    let text = message.message
    if (message.suggestions?.length)
      text += `\n\nSuggestions:\n${message.suggestions.map(s => s.desc).join('\n')}`

    return {
      type: 'error',
      id: '',
      code: 0,
      text,
      start,
      length: end - start,
      level: message.severity === 2 ? 2 : 1,
      filename: '',
    }
  })

  const nodes = resolveNodePositions(raws, code)

  const results: TwoslashShikiReturn = {
    code,
    nodes,
  }

  return results
}

export function transformerESLint(): ShikiTransformer {
  const trans = transformerTwoslash({
    // @ts-expect-error remove on next Shiki release
    twoslasher: twoslashESLint,
    errorRendering: 'hover',
    // @ts-expect-error remove on next Shiki release
    explicitTrigger: /\beslint-check\b/,
  })
  return {
    ...trans,
    // TODO: remove this wrapper on next Shiki release
    preprocess(...args) {
      if (this.options.meta?.__raw?.match(/\beslint-check\b/)) {
        const vPre = this.options.transformers?.find(i => i.name === 'vitepress:v-pre')
        if (vPre)
          this.options.transformers?.splice(this.options.transformers.indexOf(vPre), 1)
      }
      return trans.preprocess?.apply(this, args)
    },
  }
}
