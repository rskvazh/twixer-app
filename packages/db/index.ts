import { PrismaClient } from '@prisma/client'
import cuid2 from '@paralleldrive/cuid2'

export * from '@prisma/client'

let prismaClient: PrismaClient

export function prisma() {
  if (prismaClient) return prismaClient

  const ENABLE_LOG = false
  prismaClient = new PrismaClient({
    log: ENABLE_LOG ? [{ level: 'query', emit: 'event' }] : undefined,
  })

  if (ENABLE_LOG) enableLogging(prismaClient)

  return prismaClient
}

function enableLogging(prismaClient: PrismaClient) {
  // @ts-expect-error
  prismaClient.$on('query', (e: any) => {
    console.log(`${e.query} ${e.params}`)
  })
}

export const createCuid2 = cuid2.init()
