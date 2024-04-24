import { Config } from './config'
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createServer as createHttpsServer } from 'node:https'

export function createHttpServer() {
  if (Config.isDev) {
    return createHttpsServer({
      key: readFileSync(`${__dirname}/../../../certs/localhost-key.pem`),
      cert: readFileSync(`${__dirname}/../../../certs/localhost.pem`),
    })
  } else {
    return createServer()
  }
}
