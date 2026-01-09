import express from 'express';
import { Telegraf, Markup } from 'telegraf';

// Твой токен
const BOT_TOKEN = '8093456159:AAGseBkVBC6M6oKE8cXp7IT5ZCqPQNrD1j0';

// Ссылка-заглушка. Когда задеплоишь фронтенд на Netlify/Render,
// заменишь эту строчку на реальный адрес (например: https://bullrun-x.onrender.com)
const APP_URL = 'https://bullrun-x.netlify.app'; 

const bot = new Telegraf(BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// === ЛОГИКА БОТА ===

bot.start((ctx) => {
  const userName = ctx.from.first_name || 'Trader';
  
  ctx.replyWithPhoto(
    // Красивое превью (можно поменять ссылку на свою картинку)
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop', 
    {
      caption: `
<b>🚀 BullRun X: Terminal Ready</b>

Привет, <b>${userName}</b>! Добро пожаловать в элитный симулятор трейдинга.

💎 <b>Баланс демо-счета:</b> $10,000
📊 <b>Котировки:</b> Real-time симуляция
⚡️ <b>Платформа:</b> Telegram Mini App

Ты готов сделать свои первые X-ы или сольешь депозит? Рынок не прощает ошибок.

👇 <b>ЖМИ НА КНОПКУ ДЛЯ ЗАПУСКА</b>
      `,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.webApp('📈 ОТКРЫТЬ ТЕРМИНАЛ', APP_URL)
        ],
        [
          Markup.button.callback('📚 Как играть?', 'help'),
          Markup.button.url('👥 Канал', 'https://t.me/telegram')
        ]
      ])
    }
  );
});

bot.action('help', (ctx) => {
  ctx.reply(
    '💡 <b>Как играть:</b>\n\n' +
    '1. Открой терминал кнопкой выше.\n' +
    '2. Проанализируй график (можно зумить пальцами).\n' +
    '3. Выбери направление: <b>ВВЕРХ</b> (Green) или <b>ВНИЗ</b> (Red).\n' +
    '4. Если угадал движение за 1 минуту — получаешь <b>+92%</b> к ставке!',
    { parse_mode: 'HTML' }
  );
});

// Запуск бота
bot.launch().then(() => {
  console.log('🤖 Bot is running...');
}).catch((err) => {
  console.error('Bot launch error:', err);
});

// === ВЕБ-СЕРВЕР (Для Render) ===

// Простой endpoint, чтобы Render видел, что сервер жив
app.get('/', (req, res) => {
  res.send('BullRun X Server is Running! Bot status: Online.');
});

// Запуск Express сервера
app.listen(PORT, () => {
  console.log(`🌍 Server is listening on port ${PORT}`);
});

// Мягкая остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
