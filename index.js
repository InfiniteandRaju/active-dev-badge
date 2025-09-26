const { Client, GatewayIntentBits } = require("discord.js");

// Create bot client with message + guild intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Simple test command
client.on("messageCreate", (msg) => {
  if (msg.content === "!ping") {
    msg.reply("Pong!");
  }
});

// Login using token from GitHub secret
client.login(process.env.BOT_TOKEN);
