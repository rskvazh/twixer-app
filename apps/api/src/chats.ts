import { ApiTypes } from '@twixer/core'

const chats = new Map<string, ApiTypes.ChatMessage[]>()

export function saveMessage(message: ApiTypes.ChatMessage) {
  let messages = chats.get(message.matchId)
  if (!messages) {
    messages = []
    chats.set(message.matchId, messages)
  }

  messages.push(message)
}

export function getMessages(matchId: string) {
  return chats.get(matchId) ?? []
}
