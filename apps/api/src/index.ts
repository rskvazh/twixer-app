import { Server } from 'socket.io'
import { AppServer } from './types'
import { Config } from './config'
import { createCuid2, prisma } from '@twixer/db'
import { createHttpServer } from './http-server'
import { toNano } from '@ton/ton'
import { startProcessingTransactions, stopProcessingTransactions } from './ton'

const httpServer = createHttpServer()
const io: AppServer = new Server(httpServer, {
  cors: {
    origin: true,
  },
})

io.on('connection', (socket) => {
  console.log('client connected', socket.id, socket.recovered, socket.data)

  socket.join(socket.data.user.id)

  socket.on('user:signup', async (data) => {
    socket.data.user = await prisma().user.update({
      data: { name: data.name, gender: data.gender, registeredAt: new Date() },
      where: { id: socket.data.user.id },
    })
    emitCurrentUser()
  })

  socket.on('user:channels', async (callback) => {
    const channels = await prisma().userChannel.findMany({
      where: { userId: socket.data.user.id },
      include: { Channel: true },
      orderBy: { updatedAt: 'desc' },
    })
    callback(channels.map((ch) => ({ id: ch.channelId, name: ch.Channel.name, emoji: '🌎' })))
  })


  socket.on('user:report', async (data) => {
    await prisma().report.create({
      data: {
        id: createCuid2(),
        fromId: socket.data.user.id,
        toId: data.reportToUser,
        matchId: data.matchId,
      },
    })
  })

  socket.on('coins:get-offers', async (callback) => {
    const offers = await prisma().offer.findMany({
      orderBy: { coins: 'asc' },
    })

    callback({
      offers: offers.map((offer) => ({
        id: offer.id,
        coins: offer.coins,
        tons: offer.tons,
        nanotons: toNano(offer.tons).toString(),
      })),
    })
  })

  socket.on('coins:create-transaction', async (data, callback) => {
    const offer = await prisma().offer.findUniqueOrThrow({ where: { id: data.offerId } })

    const txId = createCuid2()

    const tx = await prisma().offerTransaction.create({
      data: {
        id: txId,
        comment: `${offer.coins} Twixer coins #${txId}`,
        coins: offer.coins,
        tons: offer.tons,
        nanotons: toNano(offer.tons).toString(),
        toWallet: Config.tonDepositWallet,
        offerId: offer.id,
        userId: socket.data.user.id,
      },
    })

    callback({
      transaction: { id: tx.id, toWallet: tx.toWallet, nanotons: tx.nanotons, comment: tx.comment },
    })
  })

  function emitCurrentUser() {
    const user = socket.data.user
    socket.emit('currentUser', {
      id: user.id,
      name: user.name,
      gender: user.gender,
      isRegistered: user.registeredAt !== null,
      lang: user.tgLangCode ?? 'en',
      coins: user.coins,
    })
  }

  emitCurrentUser()
})

function shutdown() {
  console.log('shutdown signal')
  stopProcessingTransactions()
  io.close()
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

httpServer.listen(Config.port)
startProcessingTransactions(io)
console.log('socket.io listening on port', Config.port)
