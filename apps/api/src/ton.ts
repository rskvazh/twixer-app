import { HttpApi, Address } from '@ton/ton'
import { prisma } from '@twixer/db'
import { AppServer } from './types'
import { emitCurrentUser } from './helpers'
import { Config } from './config'

const endpoint = Config.isDev
  ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
  : 'https://toncenter.com/api/v2/jsonRPC'
const httpClient = new HttpApi(endpoint, { apiKey: Config.tonCenterApiKey })

const wallet = Address.parse(Config.tonDepositWallet)

const MIN_INTERVAL = 6_000 // minumum interval before processing
let timer: NodeJS.Timeout

export async function startProcessingTransactions(io: AppServer) {
  const startAt = process.hrtime.bigint()
  await fetchAndProcessTransactions(io)
  const elapsed = Number((process.hrtime.bigint() - startAt) / 1_000_000n)
  const timeout = elapsed > MIN_INTERVAL ? 0 : MIN_INTERVAL - elapsed
  timer = setTimeout(() => startProcessingTransactions(io), timeout)
  timer.unref()
}

export function stopProcessingTransactions() {
  clearTimeout(timer)
}

async function fetchAndProcessTransactions(io: AppServer) {
  try {
    await fetchTonTransactions()
  } catch (e) {
    console.error('error fetchTonTransactions()', e)
  }

  try {
    await processNewTransactions(io)
  } catch (e) {
    console.error('error processNewTransactions()', e)
  }
}

async function fetchTonTransactions() {
  const allTxs = await httpClient.getTransactions(wallet, { limit: 20, archival: true })
  const txs = allTxs.filter((tx) => tx.out_msgs.length === 0)
  console.log(`Got TON transactions: all(${allTxs.length}) valid(${txs.length})`)

  for (const tx of txs) {
    await prisma().tonTransaction.upsert({
      create: {
        txIdHash: tx.transaction_id.hash,
        rcvdAt: new Date(),
        txIdLt: tx.transaction_id.lt,
        utime: new Date(tx.utime * 1000),
        inMsgDestination: tx.in_msg?.destination,
        inMsgMessage: tx.in_msg?.message,
        inMsgSource: tx.in_msg?.source,
        inMsgValue: tx.in_msg?.value,
        raw: tx,
        isProcessed: false,
      },
      update: {},
      where: { txIdHash: tx.transaction_id.hash },
    })
  }
}

async function processNewTransactions(io: AppServer) {
  const txs = await prisma().tonTransaction.findMany({
    where: { isProcessed: false },
    orderBy: { txIdLt: 'asc' },
  })

  if (txs.length === 0) return

  console.log('Not processed transactions:', txs.length)

  for (const tx of txs) {
    const [, id] = tx.inMsgMessage?.split('#') ?? []

    if (!id) {
      console.warn('processNewTransactions(): unknown id in message', tx.inMsgMessage)
      continue
    }

    const offerTx = await prisma().offerTransaction.findUnique({ where: { id } })
    if (!offerTx) {
      console.warn(
        'processNewTransactions(): unknown offer transaction in message',
        id,
        tx.txIdHash
      )
      await prisma().tonTransaction.update({
        data: { isProcessed: true },
        where: { txIdHash: tx.txIdHash },
      })
      continue
    }

    if (offerTx.nanotons !== tx.inMsgValue) {
      console.warn('processNewTransactions(): value not equal', offerTx.nanotons, id, tx.txIdHash)
      continue
    }

    await prisma().$transaction([
      prisma().tonTransaction.update({
        data: { offerTransactionId: offerTx.id, isProcessed: true },
        where: { txIdHash: tx.txIdHash },
      }),
      prisma().user.update({
        data: { coins: { increment: offerTx.coins } },
        where: { id: offerTx.userId },
      }),
    ])

    await emitCurrentUser(io, offerTx.userId)
  }
}
