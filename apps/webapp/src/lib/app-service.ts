import { get, writable } from 'svelte/store'
import {
  api as Api
} from './api'

import { localStream } from './stream'
import type { ApiTypes } from '@twixer/core'

const api = () => get(Api)

export const appState = writable<'home' | 'match' | 'account'>('home')

export const appService = {
  startMatch: () => {
    appState.set('match')
  },

  setMatch: (match: ApiTypes.MatchData) => {
    appCurrentMatch.set(match)
    apiCallRemoteStream.set(null)
  },

  onCallStarted: (ev: ApiTypes.CallStarted) => {
    apiCallStarted.set(ev)
    apiCallMessages.set([])
  },



  stop: () => {
    if (get(appState) === 'match') {
      if (get(appCurrentMatch)) {
        appCurrentMatch.set(null)
        api().client.emit('call:end')
      }
    }
    appState.set('home')

    // Safari dom freeze fix
    setTimeout(() => localStream.stop(), 400)
  },

  nextMatch: () => {
    api().client.emit('call:end')
    appCurrentMatch.set(null)
    appState.set('match')
    appMatchmakingAt.set(new Date())
  },
}
