'use strict'

const fsPromises = require('node:fs/promises')
const path = require('node:path')
const fp = require('fastify-plugin')
const csp = require('./static/csp.json')

async function fastifySwaggerUi (fastify, opts) {
  fastify.decorate('swaggerCSP', csp)

  const staticPrefix = opts.staticPrefix || '/static'

  // if no logo is provided, read default static logo
  let logoContent = opts.logo
  if (logoContent == null) {
    const bufferLogoContent = await fsPromises.readFile(path.join(__dirname, staticPrefix, 'logo.svg'))
    logoContent = { type: 'image/svg+xml', content: bufferLogoContent }
  }

  await fastify.register(require('./lib/routes'), {
    prefix: opts.routePrefix || '/documentation',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    hooks: opts.uiHooks,
    theme: opts.theme || {},
    logo: logoContent,
    staticPrefix,
    ...opts
  })
}

module.exports = fp(fastifySwaggerUi, {
  fastify: '5.x',
  name: '@fastify/swagger-ui',
  dependencies: ['@fastify/swagger']
})
module.exports.default = fastifySwaggerUi
module.exports.fastifySwaggerUi = fastifySwaggerUi
