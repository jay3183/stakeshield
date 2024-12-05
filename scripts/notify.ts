import { Webhook } from 'discord-webhook-node'
import { TelegramClient } from 'telegram'

type NotificationLevel = 'info' | 'warning' | 'critical'

interface NotificationOptions {
  level: NotificationLevel
  message: string
  data?: unknown
}

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

const discord = new Webhook(DISCORD_WEBHOOK!)
const telegram = new TelegramClient(TELEGRAM_BOT_TOKEN!)

export async function notify(options: NotificationOptions) {
  const { level, message, data } = options
  
  // Format message
  const formattedMessage = `
[${level.toUpperCase()}] ${message}
${data ? `\nDetails: ${JSON.stringify(data, null, 2)}` : ''}
  `.trim()

  // Send to Discord
  await discord.send(formattedMessage)

  // Send to Telegram
  await telegram.sendMessage(TELEGRAM_CHAT_ID!, formattedMessage)

  // Log locally
  console.log(formattedMessage)
} 