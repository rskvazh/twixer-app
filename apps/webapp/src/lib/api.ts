import { PUBLIC_API_URL } from '$env/static/public'
import { io as ioClient, Socket } from 'socket.io-client'
import type { ApiTypes } from '@twixer/core'
import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import { appService } from './app-service'

type Api = Socket<ApiTypes.ServerToClientEvents, ApiTypes.ClientToServerEvents>

export const api = apiClient()

const io: Api = ioClient(PUBLIC_API_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
})
  .onAny((...args) => console.log('RCVD:', ...args))
  .onAnyOutgoing((...args) => console.log('SENT:', ...args))
  .on('connect', () => {
    console.log('API connected!', io.recovered)
  })

interface ApiClient {
  state: 'loading' | 'error' | 'connected'
  client: Api
  error?: string
}

function apiClient() {
  const store = writable<ApiClient>({ state: 'loading', client: null as any }, (set) => {
    if (!browser) return

    io.on('connect', () => {
      set({ state: 'connected', client: io })
    })

    io.on('connect_error', (err) => {
      set({ state: 'error', client: null as any, error: String(err) })
    })

    io.on('currentUser', (user) => {
      apiCurrentUser.set(user)
    })

    io.on('match:created', (data) => {
      appService.setMatch(data)
    })

    io.on('call:started', (data) => {
      appService.onCallStarted(data)
    })

    io.on('call:ended', () => appService.onCallEnded())

    io.on('call:messages', (messages) => {
      apiCallMessages.set(messages)
    })

    if (!io.connected) {
      if (!('Telegram' in window)) {
        throw new Error('Use Telegram messenger!')
      }

      io.auth = { initData: Telegram.WebApp.initData }
      io.connect()
    }

    return () => {
      io.disconnect()
    }
  })

  return {
    subscribe: store.subscribe,
  }
}
