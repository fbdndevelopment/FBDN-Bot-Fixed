module.exports = {
  name: "play",
  async execute(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("❌ Join a voice channel first!");

    const query = args.join(" ");
    if (!query) return message.reply("❌ Provide a song name!");

    try {
      await client.distube.play(voiceChannel, query, {
        member: message.member,
        textChannel: message.channel
      });
    } catch (e) {
      console.error(e);
      message.reply("❌ Error playing song.");
    }
  }
};
