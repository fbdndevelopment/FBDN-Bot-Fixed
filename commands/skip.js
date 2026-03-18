module.exports = {
  name: "skip",
  execute(message, args, client) {
    const queue = client.play-dl.getQueue(message);
    if (!queue) return message.reply("❌ Nothing playing.");

    queue.skip();
    message.reply("⏭️ Skipped!");
  }
};
