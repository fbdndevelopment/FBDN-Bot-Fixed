const { Client, GatewayIntentBits } = require("discord.js");
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus 
} = require("@discordjs/voice");
const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("❌ Join a voice channel first!");

    const query = args.join(" ");
    if (!query) return message.reply("❌ Enter a song name!");

    try {
      // 🔍 Search YouTube
      const result = await play.search(query, { limit: 1 });

      if (!result || result.length === 0) {
        return message.reply("❌ No results found.");
      }

      const url = result[0].url;

      // 🎵 Get stream
      const stream = await play.stream(url);

      // 🔊 Join VC
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();

      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log("🎶 Playing audio...");
      });

      player.on("error", error => {
        console.error("Audio error:", error);
        message.reply("❌ Error during playback.");
      });

      message.reply(`🎶 Now playing: ${result[0].title}`);

    } catch (err) {
      console.error(err);
      message.reply("❌ Error playing song.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
