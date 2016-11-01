'use strict'
const fs = require('fs')
const path = require('path')

const babel = require('babel-core')

function withBabelEnv(fn) {
  const oldBabelEnv = process.env.BABEL_ENV
  process.env.BABEL_ENV = atom.inDevMode() ? 'development' : 'production'
  const res = fn()
  process.env.BABEL_ENV = oldBabelEnv
  return res
}

module.exports = {
  getCacheKeyData: function (source, filename, options, meta) {
    return withBabelEnv(function() {
      let cacheKeyData = ''
      if (options.cacheKeyFiles) {
        cacheKeyData = options.cacheKeyFiles.reduce((acc, relPath) => {
          return `${acc}\n${fs.readFileSync(path.join(meta.path, relPath))}`
        }, '')
      }

      return `${cacheKeyData}\nenv:${process.env.BABEL_ENV}`
    })
  },

  transpile: function (source, filename, options, meta) {
    return withBabelEnv(function () {
      const result = babel.transform(source, Object.assign({},
      (options.babel || {}), {
        sourceRoot: meta.path,
        filename: filename
      }))
      return {code: result.code, map: result.map}
    })
  }
}
