import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config'; // Важно для загрузки .env файла локально

// Получаем переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL; // Ссылка на твой Netlify сайт

// Проверка токена и ссылки
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set. Please set it in .env or as environment variable.');
}
if (!APP_URL) {
  // Локальная заглушка для разработки
  console.warn('APP_URL is not set. Using a default placeholder. Set APP_URL for production.');
  // Можно подставить локальный vite URL для теста, например:
  // APP_URL = 'http://localhost:5173'; 
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
// Render устанавливает PORT, иначе используем 3000
const PORT = process.env.PORT || 3000; 

// === ЛОГИКА БОТА ===

bot.start((ctx) => {
  const userName = ctx.from.first_name || 'Trader';
  
  ctx.replyWithPhoto(
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop', 
    {
      caption: `<b>🚀 BullRun X: Terminal Ready</b>\n\nПривет, <b>${userName}</b>! Готов к торговле?`,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('📈 ОТКРЫТЬ ТЕРМИНАЛ', APP_URL)]
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
  console.log('🤖 Bot started successfully.');
}).catch((err) => {
  console.error('Failed to launch bot:', err);
});

// === ВЕБ-СЕРВЕР (Для Render) ===
// Отдаем статику из vite build для Render (если нужно, но для мини-приложения не обязательно)
// app.use(express.static('dist')); 

app.get('/', (req, res) => {
  res.send('BullRun X Server is running. Bot is active.');
});

app.listen(PORT, () => {
  console.log(`🌍 Server listening on port ${PORT}`);
});

// Обработка остановки
process.once('SIGINT', () => {
  console.log('SIGINT received. Stopping bot and server...');
  bot.stop('SIGINT');
  process.exit(0);
});
process.once('SIGTERM', () => {
  console.log('SIGTERM received. Stopping bot and server...');
  bot.stop('SIGTERM');
  process.exit(0);
});
