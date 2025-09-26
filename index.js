require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { exec } = require('child_process');

const TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.BOT_OWNER_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Whitelisted commands
const COMMAND_WHITELIST = {
  uptime: 'uptime',
  disk: 'df -h',
  meminfo: 'free -h'
};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const [name] = message.content.slice(prefix.length).trim().split(/\s+/);

  if (message.author.id !== OWNER_ID) {
    return message.reply('You are not authorized.');
  }

  if (!COMMAND_WHITELIST[name]) {
    return message.reply('Command not allowed. Use !help to see allowed commands.');
  }

  exec(COMMAND_WHITELIST[name], { timeout: 10000, maxBuffer: 2000 * 1024 }, (err, stdout, stderr) => {
    if (err) return message.reply(`Error: ${err.message}`);
    const out = (stdout || '').slice(0, 1900) || (stderr || 'No output');
    message.reply(`Output:\n\`\`\`\n${out}\n\`\`\``);
  });
});

client.login(TOKEN);
