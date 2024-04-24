import { Context } from 'telegraf'
import { User } from '@twixer/db'
import type { Analytics } from './analytics'

export interface BotContext extends Context {
  dbUser: User
  dbUserFirstCreated: boolean
  analytics: Analytics
}
