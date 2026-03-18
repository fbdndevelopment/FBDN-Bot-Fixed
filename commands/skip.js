module.exports = {
  name: "skip",
  execute(message, args, client) {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.reply("❌ Nothing playing.");

    queue.skip();
    message.reply("⏭️ Skipped!");
  }
};
