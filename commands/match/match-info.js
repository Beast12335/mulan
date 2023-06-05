const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require('../../db/match.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-info')
    .setDescription('Shows info for a face cam match')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNickname)
    .addStringOption((option) =>
      option
        .setName('teams')
        .setDescription('Enter the team names')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const c = await match.find();
    const choices = c.map((t) => {
      return t.teams;
    });
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({name: choice, value: choice}))
    );
  },
  async execute(interaction) {
    await interaction.deferReply();
    try {
      let team = interaction.options.getString('teams');
      let record = await match.findOne({teams:team.split(' vs ').join(',')});
      let players = record.tags
      let dc = record.dc
      let img = record.img1
      let img2 = record.img2
      let embed = new EmbedBuilder()
        .setTitle('Match Info')
        .setColor(0x13ff00)
        .setDescription(`Match : ${team}\n Players : ${players}\n Discord Id of Players : ${dc}`);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
      await channel.send({content:img})
      await channel.send({content:img2})
    } catch (e) {
      let embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xff0000)
        .setDescription(e);
      await interaction.followUp({
        content: '',
        embeds: [embed],
      });
    }
  },
};
