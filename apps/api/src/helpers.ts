import { prisma } from '@twixer/db'
import { AppServer } from './types'

export async function emitCurrentUser(io: AppServer, userId: string) {
  const user = await prisma().user.findUniqueOrThrow({ where: { id: userId } })

  io.to(user.id).emit('currentUser', {
    id: user.id,
    name: user.name,
    gender: user.gender,
    isRegistered: user.registeredAt !== null,
    lang: user.tgLangCode ?? 'en',
    coins: user.coins,
  })
}
