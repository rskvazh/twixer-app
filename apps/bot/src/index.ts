import { Telegraf, Markup } from 'telegraf'
import { Config } from './config'
import { BotContext } from './bot-context'
import { tr } from './i18n'
import { Animation } from 'telegraf/types'
import { telestats } from '@telestats/telegraf'

const bot = new Telegraf<BotContext>(Config.botToken, { handlerTimeout: 30_000 })
bot.use(telestats(Config.telestatsToken))

bot.telegram.setMyCommands([
  { command: 'start', description: 'Start' },
  { command: 'add', description: 'Add to Your Channel' },
  { command: 'feedback', description: 'Feedback' },
])
bot.telegram.setChatMenuButton({ menuButton: { type: 'commands' } })

// bot.telegram.setChatMenuButton({
//   menuButton: {
//     text: 'Launch',
//     type: 'web_app',
//     web_app: { url: Config.botWebappUrl },
//   },
// })

bot.use(async (ctx, next) => {
  console.log(ctx.update)
  await next()
})

function buildStartVideoChatInline(locale: string | null) {
  return Markup.inlineKeyboard([
    [Markup.button.webApp(tr('start_video_chat', locale), Config.botWebappUrl)],
  ])
}

let twirlAnimation: Animation | null = null

bot.start(async (ctx) => {
  const payload = String(ctx.startPayload)

  const result = await ctx.replyWithAnimation(file, {
    caption: tr('start_message', ctx.dbUser.tgLangCode),
    ...buildStartVideoChatInline(ctx.dbUser.tgLangCode),
  })

  if (!twirlAnimation) {
    twirlAnimation = result.animation
  }
})


bot.command('add', (ctx) => {
  ctx.reply(tr('add_to_your_channel', ctx.dbUser.tgLangCode), {
    ...buildStartVideoChatInline(ctx.dbUser.tgLangCode),
    disable_web_page_preview: true,
  })

  ctx.analytics.menuAddChannel()
})

bot.command('feedback', (ctx) => {
  ctx.reply(tr('feedback_message', ctx.dbUser.tgLangCode), {
    ...buildStartVideoChatInline(ctx.dbUser.tgLangCode),
    disable_web_page_preview: true,
  })
  ctx.analytics.menuFeedback()
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('bot launched')
