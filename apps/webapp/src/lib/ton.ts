import { browser, dev } from '$app/environment'
import { CHAIN, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import { writable } from 'svelte/store'
import { beginCell } from '@ton/core'
import type { ApiTypes } from '@twixer/core'

const NETWORK = dev ? CHAIN.TESTNET : CHAIN.MAINNET

type TonConnectStore =
  | {
      connected: false
    }
  | {
      connected: true
      walletAddress: string
      walletAddressShort: string
    }

function createTonConnectStore() {
  let tonConnectUI: TonConnectUI | undefined
  const { set, subscribe } = writable<TonConnectStore>({
    connected: false,
  })

  if (browser) {
    tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://app.twixer.bot/tonconnect-manifest.json',
    })

    tonConnectUI.onStatusChange(
      (wallet) => {
        console.log('ton onStatusChange', tonConnectUI!.connected, wallet)
        if (wallet) {
          const walletAddress = toUserFriendlyAddress(wallet.account.address)
          const walletAddressShort = walletAddress.substring(0, 4) + '...' + walletAddress.slice(-4)
          set({ connected: true, walletAddress, walletAddressShort })
        } else {
          set({ connected: false })
        }
      },
      (errors) => {
        console.error('ton errors', errors)
      }
    )
  }

  return {
    subscribe,
    async ensureConnectWallet() {
      if (!tonConnectUI) return false
      if (tonConnectUI.connected) return true

      const connecting = new Promise<boolean>((resolve) => {
        const unsub = tonConnectUI.onModalStateChange((state) => {
          if (state.status === 'closed') {
            unsub()
            resolve(tonConnectUI.connected)
          }
        })
      })

      tonConnectUI.openModal()

      return connecting.then((result) => {
        console.log('wallet modal closed, connected', result)
        return result
      })
    },

    async disconnectWallet() {
      await tonConnectUI?.disconnect()
      console.log('wallet disconnected')
    },

    async purchase(tx: ApiTypes.CoinsTransaction) {
      console.log('purchase offer', tx)

      const body = beginCell()
        .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
        .storeStringTail(tx.comment) // write our text comment
        .endCell()

      const result = await tonConnectUI?.sendTransaction(
        {
          messages: [
            {
              address: tx.toWallet,
              amount: tx.nanotons,
              payload: body.toBoc().toString('base64'),
            },
          ],
          validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
          network: NETWORK,
        },
        { modals: 'all', notifications: 'all' }
      )

      console.log('purchase result', result)
    },
  }
}

export const tonConnect = createTonConnectStore()
