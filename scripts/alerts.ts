import { WebhookClient } from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';

const discordWebhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL! });
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

export async function sendDiscordAlert(message: string) {
    await discordWebhook.send(message);
}

export async function sendTelegramAlert(message: string) {
    await telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID!, message);
} 