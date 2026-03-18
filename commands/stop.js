module.exports = {
  name: "stop",
  execute(message, args, client) {
    const queue = client.play-dl.getQueue(message);
    if (!queue) return message.reply("❌ Nothing playing.");

    queue.stop();
    message.reply("⏹️ Stopped music.");
  }
};
