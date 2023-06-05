const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('player-claim')
    .setDescription('Claim a player')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Enter the player tag')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('Enter the api token found in game')
        .setRequired(true)
    ),
}
