const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "ban",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply("❌ You don't have permission to ban.");
    }

    const user = message.mentions.members.first();
    if (!user) {
      return message.reply("❌ Please mention a user to ban.");
    }

    if (!user.bannable) {
      return message.reply("❌ I can't ban this user.");
    }

    try {
      await user.ban();
      message.reply(`✅ Banned ${user.user.tag}`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to ban user.");
    }
  }
};
