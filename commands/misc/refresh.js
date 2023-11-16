const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const player = require('../../db/player.js');
const claim = require('../../db/claim.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Add a player image'),


  async execute(interaction) {
    await interaction.deferReply();
    try {
      const data = await player.find()
      
      const channel = interaction.client.channels.cache.get('1174574152947081277')
      await data.forEach(async (item) => {
        await new Promise((resolve) => setTimeout(resolve, 450)); // Wait for 0.45 seconds
        await channel.send(item.toString());
      });
    } catch (e) {
      let err = new EmbedBuilder()
        .setColor(0xffff11)
        .setTitle('Error')
        .setDescription(e.message);
      console.log(e);
      await interaction.followUp({
        content: '',
        embeds: [err],
      });
    }
  },
};
