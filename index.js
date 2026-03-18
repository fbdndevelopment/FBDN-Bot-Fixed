const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Music system (WORKS WITHOUT LAVALINK)
client.distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()]
});

client.commands = new Collection();

// Load commands
const fs = require("fs");
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Command handler
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).split(" ");
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error running command.");
  }
});

// Music events
client.distube
  .on("playSong", (queue, song) => {
    queue.textChannel.send(`🎶 Now playing: **${song.name}**`);
  })
  .on("error", (channel, error) => {
    console.error(error);
    channel.send("❌ Error playing song.");
  });

client.login(process.env.DISCORD_TOKEN);
