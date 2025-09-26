const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// No need for dotenv in GitHub Actions - use process.env directly
const token = process.env.DISCORD_TOKEN;

console.log('=== Bot Starting ===');
console.log('Environment check:');
console.log('Token exists:', !!token);
console.log('Token length:', token ? token.length : 'MISSING');

// Validate token
if (!token) {
    console.error('❌ ERROR: DISCORD_TOKEN environment variable is missing!');
    console.error('Please add your bot token to GitHub Secrets');
    process.exit(1);
}

if (token === 'YOUR_BOT_TOKEN_HERE' || token.includes(' ') || token.length < 50) {
    console.error('❌ ERROR: Invalid token format detected!');
    console.error('Token should be a long string without spaces');
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Simple commands
const commands = [
    {
        name: 'ping',
        description: 'Check bot latency'
    },
    {
        name: 'hello',
        description: 'Say hello to the bot'
    },
    {
        name: 'github',
        description: 'Get GitHub repository info'
    }
];

client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log('Bot is ready and connected to Discord!');
    
    try {
        const rest = new REST({ version: '10' }).setToken(token);
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('✅ Slash commands registered successfully!');
        console.log('Commands available:');
        commands.forEach(cmd => console.log(`- /${cmd.name}: ${cmd.description}`));
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        if (interaction.commandName === 'ping') {
            const latency = Date.now() - interaction.createdTimestamp;
            await interaction.reply(`🏓 Pong! Latency: ${latency}ms`);
        }

        if (interaction.commandName === 'hello') {
            await interaction.reply(`Hello ${interaction.user.username}! 👋`);
        }

        if (interaction.commandName === 'github') {
            await interaction.reply({
                embeds: [{
                    title: 'GitHub Repository',
                    description: 'This bot is running on GitHub Actions!',
                    color: 0x00FF00,
                    fields: [
                        { name: 'Repository', value: 'https://github.com/yourusername/active-dev-badge', inline: true },
                        { name: 'Platform', value: 'Node.js + GitHub Actions', inline: true }
                    ]
                }]
            });
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.reply('❌ An error occurred while processing your command.');
    }
});

client.on('error', (error) => {
    console.error('Discord client error:', error);
});

// Login with error handling
console.log('Attempting to login...');
client.login(token).catch(error => {
    console.error('❌ Login failed!');
    console.error('Error details:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if the token is correct in GitHub Secrets');
    console.log('2. Make sure the bot is properly created in Discord Developer Portal');
    console.log('3. Verify the token has not been reset');
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down...');
    client.destroy();
    process.exit(0);
});
