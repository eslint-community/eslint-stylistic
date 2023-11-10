'use strict'

import { getFromContext } from './pragma'
import { getLatestVariableDefinition, getVariable, variablesInScope } from './variable'

/**
 * Check if variable is destructured from pragma import
 *
 * @param {string} variable The variable name to check
 * @param {Context} context eslint context
 * @returns {boolean} True if createElement is destructured from the pragma
 */
export default function isDestructuredFromPragmaImport(variable, context) {
  const pragma = getFromContext(context)
  const variables = variablesInScope(context)
  const variableInScope = getVariable(variables, variable)
  if (variableInScope) {
    const latestDef = getLatestVariableDefinition(variableInScope)
    if (latestDef) {
      // check if latest definition is a variable declaration: 'variable = value'
      if (latestDef.node.type === 'VariableDeclarator' && latestDef.node.init) {
        // check for: 'variable = pragma.variable'
        if (
          latestDef.node.init.type === 'MemberExpression'
              && latestDef.node.init.object.type === 'Identifier'
              && latestDef.node.init.object.name === pragma
        )
          return true

        // check for: '{variable} = pragma'
        if (
          latestDef.node.init.type === 'Identifier'
              && latestDef.node.init.name === pragma
        )
          return true

        // "require('react')"
        let requireExpression = null

        // get "require('react')" from: "{variable} = require('react')"
        if (latestDef.node.init.type === 'CallExpression')
          requireExpression = latestDef.node.init

        // get "require('react')" from: "variable = require('react').variable"
        if (
          !requireExpression
              && latestDef.node.init.type === 'MemberExpression'
              && latestDef.node.init.object.type === 'CallExpression'
        )
          requireExpression = latestDef.node.init.object

        // check proper require.
        if (
          requireExpression
              && requireExpression.callee
              && requireExpression.callee.name === 'require'
              && requireExpression.arguments[0]
              && requireExpression.arguments[0].value === pragma.toLocaleLowerCase()
        )
          return true

        return false
      }

      // latest definition is an import declaration: import {<variable>} from 'react'
      if (
        latestDef.parent
            && latestDef.parent.type === 'ImportDeclaration'
            && latestDef.parent.source.value === pragma.toLocaleLowerCase()
      )
        return true
    }
  }
  return false
}
