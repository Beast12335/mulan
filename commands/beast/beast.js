const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const player = require('../../db/player.js');
const match = require('../../db/match.js')
const claim = require('../../db/claim.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('beast')
    .setDescription('Beast only cmd')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('cmd')
        .setDescription('ifkyk')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    await interaction.deferReply();
    try {
      let tag = interaction.getString('cmd')
      let b = await tag
      let embed = new EmbedBuilder()
      .setTitle('Sucess')
      .setColor(0x13ff00)
      .setDescription(b);
      
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    } catch (e) {
      let embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xffff11)
        .setDescription(e.message);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    }
  },
};
