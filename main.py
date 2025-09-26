import discord
from discord import app_commands
import os
import asyncio

intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

@tree.command(name="ping", description="Check bot latency")
async def ping(interaction: discord.Interaction):
    latency = round(client.latency * 1000)
    await interaction.response.send_message(f"🏓 Pong! {latency}ms")

@tree.command(name="info", description="Get bot information")
async def info(interaction: discord.Interaction):
    embed = discord.Embed(title="Bot Info", color=0x00ff00)
    embed.add_field(name="Developer", value="GitHub Bot", inline=True)
    embed.add_field(name="Status", value="Online", inline=True)
    await interaction.response.send_message(embed=embed)

@client.event
async def on_ready():
    try:
        await tree.sync()
        print(f'✅ {client.user} is online!')
        print('Bot is ready and commands are synced!')
    except Exception as e:
        print(f'Error syncing commands: {e}')

async def main():
    token = os.getenv('DISCORD_TOKEN')
    if not token:
        print("❌ ERROR: DISCORD_TOKEN environment variable is missing!")
        print("Please add your bot token to GitHub Secrets")
        return
    
    try:
        await client.start(token)
    except KeyboardInterrupt:
        print("Bot stopped by user")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
