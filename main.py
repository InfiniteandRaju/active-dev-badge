import discord
from discord import app_commands
import os

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
    embed.add_field(name="Developer", value="YourName", inline=True)
    embed.add_field(name="Commands", value="2", inline=True)
    await interaction.response.send_message(embed=embed)

@client.event
async def on_ready():
    await tree.sync()
    print(f'✅ {client.user} is online!')

if __name__ == "__main__":
    client.run(os.getenv('DISCORD_TOKEN'))
