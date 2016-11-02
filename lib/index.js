'use strict'

function withBabelEnv(setBabelEnv, fn) {
  if (setBabelEnv === false) {
    return fn()
  }

  const oldBabelEnv = process.env.BABEL_ENV
  process.env.BABEL_ENV = atom.inDevMode() ? 'development' : 'production'
  const res = fn()
  process.env.BABEL_ENV = oldBabelEnv
  return res
}

module.exports = {
  getCacheKeyData: function (source, filename, options, meta) {
    const fs = require('fs')
    const path = require('path')

    const pkgJsonData = fs.readFileSync(path.join(__dirname, 'package.json'))

    let cacheKeyData = ''
    if (options.cacheKeyFiles) {
      cacheKeyData = options.cacheKeyFiles.reduce((acc, relPath) => {
        return `${acc}\n${fs.readFileSync(path.join(meta.path, relPath))}`
      }, '')
    }

    return withBabelEnv(options.setBabelEnv, function() {
      return `${cacheKeyData}\nenv:${process.env.BABEL_ENV}\nv:${pkgJsonData.version}`
    })
  },

  transpile: function (source, filename, options, meta) {
    const babel = require('babel-core')

    return withBabelEnv(options.setBabelEnv, function () {
      const result = babel.transform(source, Object.assign({},
      (options.babel || {}), {
        sourceRoot: meta.path,
        filename: filename
      }))
      return {code: result.code, map: result.map}
    })
  }
}
