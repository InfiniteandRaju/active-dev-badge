const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Slash commands setup
const commands = [
    {
        name: 'ping',
        description: 'Check bot latency'
    },
    {
        name: 'info',
        description: 'Get bot information'
    },
    {
        name: 'help',
        description: 'Show help menu'
    }
];

// Register commands when bot starts
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is online!`);
    
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error refreshing commands:', error);
    }
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply(`🏓 Pong! Latency: ${Date.now() - interaction.createdTimestamp}ms`);
    }

    if (interaction.commandName === 'info') {
        await interaction.reply({
            embeds: [{
                title: 'Bot Information',
                description: 'This bot is running on GitHub Actions!',
                color: 0x00FF00,
                fields: [
                    { name: 'Developer', value: 'GitHub Bot', inline: true },
                    { name: 'Platform', value: 'Node.js', inline: true },
                    { name: 'Status', value: 'Online', inline: true }
                ]
            }]
        });
    }

    if (interaction.commandName === 'help') {
        await interaction.reply({
            content: '**Available Commands:**\n`/ping` - Check latency\n`/info` - Bot information\n`/help` - This menu'
        });
    }
});

// Error handling
client.on('error', (error) => {
    console.error('Discord.js error:', error);
});

// Login with token validation
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('❌ ERROR: DISCORD_TOKEN environment variable is missing!');
    console.error('Please add your bot token to GitHub Secrets');
    process.exit(1);
}

if (token === 'YOUR_BOT_TOKEN_HERE' || token.length < 10) {
    console.error('❌ ERROR: Invalid token detected!');
    console.error('Please replace with your actual bot token');
    process.exit(1);
}

client.login(token).catch(error => {
    console.error('Login failed:', error.message);
    process.exit(1);
});
