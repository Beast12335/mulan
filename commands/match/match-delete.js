const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');
const match = require('../../db/match.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('match-delete')
    .setDescription('Deletes a face cam match.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption((option) =>
      option
        .setName('match')
        .setDescription('Choose the match')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let t = await match.find()
    const choices = t.map((u)=>{
      return u.teams })
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
      let matc = interaction.options.getString('match').split(' vs ').join(' ');
      let tea = await match.deleteOne({teams:matc});
      let embed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('Sucess')
        .setDescription('Match `${matc}` have deleted successfully.');
      await interaction.followUp({
        content: '',
        embeds: [embed],
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
